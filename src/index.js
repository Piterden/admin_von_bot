require('dotenv').config()
require('module-alias/register')

const knex = require('knex')
const Telegraf = require('telegraf')
const Markup = require('telegraf/markup')

const { debug, onError } = require('@/helpers')
const knexConfig = require('@/../knexfile')

const { session } = Telegraf
const { BOT_NAME, BOT_TOKEN } = process.env

const bot = new Telegraf(BOT_TOKEN, { username: BOT_NAME })

bot.context.database = knex(knexConfig)

bot.use(session())

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
bot.use()

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
 * Restricting to post links during defined time
 */
bot.entity(({ type }) => type === 'url', async (ctx) => {
  // ctx.session.user
})

/**
 * Bot was added to a group
 */
bot.on('new_chat_members', async (ctx) => {
  const date = new Date()

  if (ctx.message.new_chat_member.username === BOT_NAME) {
    const [chat] = await ctx.database('groups')
      .where({ id: Number(ctx.chat.id) })
      .catch(onError)

    if (chat) {
      const diff = Object.keys(ctx.chat).reduce((acc, key) => {
        if (key === 'id') {
          chat[key] = Number(chat[key])
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
          .update({ ...diff, active: true, updated_at: date })
          .catch(onError)
      }
    } else {
      await ctx.database('groups')
        .insert({
          ...ctx.chat,
          active: true,
          config: JSON.stringify({}),
          created_at: date,
        })
        .catch(onError)
    }
    return
  }

  if (!ctx.message.new_chat_member.is_bot) {
    ctx.session.restricted = await ctx.restrictChatMember(
      ctx.message.new_chat_member.id,
      {
        can_send_messages: false,
        can_send_media_messages: false,
        can_send_other_messages: false,
        can_add_web_page_previews: false,
      }
    )

    await ctx.reply(
      'Нажмите на кнопу, чтобы продолжить общение.',
      Markup.inlineKeyboard([
        Markup.callbackButton('Кнопа', 'pass'),
      ]).extra()
    )

    await ctx.database('users_groups')
      .insert({
        user_id: ctx.message.new_chat_member.id,
        group_id: ctx.chat.id,
        trusted: false,
        created_at: date,
      })
      .catch(onError)
  }

  await ctx.deleteMessage(ctx.message.message_id)
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

  await ctx.database('users_groups')
    .delete({
      user_id: ctx.message.left_chat_member.id,
      group_id: ctx.chat.id,
    })
    .catch(onError)

  await ctx.deleteMessage(ctx.message.message_id)
})

/**
 * Unmute user after captcha pass
 */
bot.action('pass', async (ctx) => {
  if (!ctx.session.restricted) {
    return ctx.answerCbQuery('Не ты, балда!!!')
  }

  await ctx.restrictChatMember(
    ctx.from.id,
    {
      can_send_messages: true,
      can_send_media_messages: true,
      can_send_other_messages: true,
      can_add_web_page_previews: true,
    }
  )

  ctx.session.restricted = false
  await ctx.deleteMessage()

  return ctx.answerCbQuery('Спасибо!!!')
})

bot.startPolling()
