require('dotenv').config()
require('module-alias/register')

const knex = require('knex')
const Telegraf = require('telegraf')
const Markup = require('telegraf/markup')

const knexConfig = require('@/../knexfile')
const { errorHandler } = require('@/helpers')
const { voiceHandler, stickerHandler } = require('@/handlers')
const { userMiddleware, debugMiddleware } = require('@/middlewares')

const { session } = Telegraf
const { BOT_NAME, BOT_TOKEN } = process.env

const bot = new Telegraf(BOT_TOKEN, { username: BOT_NAME })

bot.context.database = knex(knexConfig)

/**
 * Middlewares
 */
bot.use(session())
bot.use(userMiddleware())
bot.use(debugMiddleware())

/**
 * Handlers
 */
bot.on('voice', voiceHandler())
bot.on('sticker', stickerHandler())
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
      .catch(errorHandler)

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
          .catch(errorHandler)
      }
    } else {
      await ctx.database('groups')
        .insert({
          ...ctx.chat,
          active: true,
          config: JSON.stringify({}),
          created_at: date,
        })
        .catch(errorHandler)
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

    const captcha = await ctx.reply(
      `Привет, @${ctx.message.new_chat_member.username}, нажми на кнопу, чтобы начать общение.`,
      Markup.inlineKeyboard([
        Markup.callbackButton(
          'Кнопа',
          `pass=${ctx.message.new_chat_member.id}`
        ),
      ]).extra()
    )

    ctx.session.timeoutToKick = setTimeout(() => {
      ctx.session.timeoutToKick = null
      ctx.kickChatMember(ctx.message.new_chat_member.id)
      ctx.deleteMessage(captcha.message_id)
    }, 300000)

    await ctx.database('users_groups')
      .insert({
        user_id: ctx.message.new_chat_member.id,
        group_id: ctx.chat.id,
        trusted: false,
        created_at: date,
      })
      .catch(errorHandler)
  }

  setTimeout(() => {
    ctx.deleteMessage(ctx.message.message_id)
  })
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
      .catch(errorHandler)
  }

  await ctx.database('users_groups')
    .delete({
      user_id: ctx.message.left_chat_member.id,
      group_id: ctx.chat.id,
    })
    .catch(errorHandler)

  await ctx.deleteMessage(ctx.message.message_id)
})

/**
 * Unmute user after captcha pass
 */
bot.action(/^pass=(\d+)/, async (ctx) => {
  if (!ctx.session.restricted || ctx.from.id !== Number(ctx.match[1])) {
    return ctx.answerCbQuery('Не ты, балда!!!')
  }

  if (ctx.session.timeoutToKick) {
    clearTimeout(ctx.session.timeoutToKick)
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
