require('dotenv').config()
require('module-alias/register')

const knex = require('knex')
const Telegraf = require('telegraf')

const knexConfig = require('@/../knexfile')

const { userMiddleware, debugMiddleware } = require('@/middlewares')
const {
  kickHandler,
  passHandler,
  voiceHandler,
  stickerHandler,
  animationHandler,
  newChatMemberHandler,
  leftChatMemberHandler,
} = require('@/handlers')

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
bot.on('animation', animationHandler())
bot.on('new_chat_members', newChatMemberHandler())
bot.on('left_chat_member', leftChatMemberHandler())

bot.action(/^kick=(\d+)/, kickHandler())
bot.action(/^pass=(\d+)/, passHandler())

bot.action(/^action=(\w+)/, async (ctx) => {
  switch (ctx.match[1]) {
    case 'delete':
      ctx.tg.deleteMessage(ctx.chat.id, ctx.update.callback_query.message.message_id)
      break
    default:
  }
})

// bot.entity(({ type }) => type === 'url', async (ctx) => {
//   // ctx.session.user
// })

bot.startPolling()
