require('dotenv').config()
require('module-alias/register')

const knex = require('knex')
const Telegraf = require('telegraf')

const { debug } = require('@/helpers')
const knexConfig = require('@/../knexfile')

// const { session } = Telegraf
const { BOT_NAME, BOT_TOKEN } = process.env

const bot = new Telegraf(BOT_TOKEN, { username: BOT_NAME })

const onError = (error) => console.log(error)

bot.context.database = knex(knexConfig)

bot.use(async (ctx, next) => {
  debug(ctx.update)

  next(ctx)
})

bot.on('sticker', async (ctx) => {
  setTimeout(() => {
    ctx.deleteMessage(ctx.update.message.message_id)
  }, 30000)
})

bot.on('voice', async (ctx) => {
  ctx.deleteMessage(ctx.update.message.message_id)
})

/**
 * User middleware
 */
bot.use(async (ctx, next) => {
  const [user] = await ctx.database('users').where({ id: Number(ctx.from.id) })
  const date = new Date()

  if (user) {
    return next()
  }

  await ctx.database('users').insert({
    ...ctx.from,
    created_at: date,
    updated_at: date,
  })

  return next()
})

/**
 * Bot was added to a group
 */
bot.on('new_chat_members', async (ctx) => {
  if (ctx.message.new_chat_member.username === BOT_NAME) {
    const [chat] = await ctx.database('groups')
      .where({ id: Number(ctx.chat.id) })
      .catch(onError)
    const date = new Date()

    if (chat) {
      await ctx.database('groups')
        .where({ id: Number(chat.id) })
        .update({ active: true, updated_at: date })
        .catch(onError)
    } else {
      const { id, title, type } = ctx.chat

      await ctx.database('groups')
        .insert({
          type,
          title,
          id: Number(id),
          active: true,
          config: '{}',
          created_at: date,
          updated_at: date,
        })
        .catch(onError)
    }
  }
})

/**
 * Bot was removed from group
 */
bot.on('left_chat_member', async (ctx) => {
  if (ctx.message.left_chat_member.username === BOT_NAME) {
    const date = new Date()

    await ctx.database('groups')
      .where({ id: Number(ctx.chat.id) })
      .update({ active: false, updated_at: date })
      .catch(onError)
  }
})

bot.startPolling()
