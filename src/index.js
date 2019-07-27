require('dotenv').config()
require('module-alias/register')

const knex = require('knex')
const Telegraf = require('telegraf')

const { debug } = require('@/helpers')
const knexConfig = require('@/../knexfile')

// const { session } = Telegraf
const { BOT_NAME, BOT_TOKEN } = process.env

const onError = (error) => console.log(error)

const bot = new Telegraf(BOT_TOKEN, { username: BOT_NAME })

bot.context.database = knex(knexConfig)

/**
 * Log middleware
 */
bot.use(async (ctx, next) => {
  debug(ctx.update)
  next(ctx)
})

/**
 * User store middleware
 */
bot.use(async (ctx, next) => {
  const [user] = await ctx.database('users')
    .where({ id: Number(ctx.from.id) })
    .catch(onError)
  const date = new Date()

  if (user) {
    const diff = Object.keys(ctx.from).reduce((acc, key) => {
      if (key === 'id') {
        return acc
      }
      if (typeof ctx.from[key] === 'boolean') {
        user[key] = Boolean(user[key])
      }
      if (ctx.from[key] !== user[key]) {
        acc[key] = ctx.from[key]
      }
      return acc
    }, {})

    if (Object.keys(diff).length > 0) {
      await ctx.database('users')
        .where({ id: Number(ctx.from) })
        .update({ diff, updated_at: date })
        .catch(onError)
    }
    return next()
  }

  await ctx.database('users')
    .insert({ ...ctx.from, created_at: date })
    .catch(onError)

  return next()
})

/**
 * Removing stickers after 30 sec delay
 */
bot.on('sticker', async (ctx) => {
  setTimeout(() => {
    ctx.deleteMessage(ctx.update.message.message_id)
  }, 30000)
})

/**
 * Removing voices
 */
bot.on('voice', async (ctx) => {
  await ctx.deleteMessage(ctx.update.message.message_id)
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
      const diff = Object.keys(ctx.chat).reduce((acc, key) => {
        if (key === 'id') {
          return acc
        }
        if (typeof ctx.chat[key] === 'boolean') {
          chat[key] = Boolean(chat[key])
        }
        if (ctx.chat[key] !== chat[key]) {
          acc[key] = ctx.chat[key]
        }
        return acc
      }, {})

      if (Object.keys(diff).length > 0) {
        await ctx.database('groups')
          .where({ id: Number(chat.id) })
          .update({ active: true, updated_at: date })
          .catch(onError)
      }
    } else {
      await ctx.database('groups')
        .insert({
          ...ctx.chat,
          active: true,
          config: '{}',
          created_at: date,
        })
        .catch(onError)
    }
  }
  await ctx.deleteMessage(ctx.update.message.message_id)
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
  await ctx.deleteMessage(ctx.update.message.message_id)
})

bot.startPolling()
