require('dotenv').config()
require('module-alias/register')

const knex = require('knex')
const Telegraf = require('telegraf')

const knexConfig = require('@/../knexfile')
const { captchaCommand } = require('@/commands')
const { userMiddleware, debugMiddleware } = require('@/middlewares')
const { kickAction, passAction, actionsAction } = require('@/actions')
const {
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

/**
 * Actions
 */
bot.action(/^kick=(\d+)/, kickAction())
bot.action(/^pass=(\d+)/, passAction())
bot.action(/^action=(\w+)/, actionsAction())

/**
 * Commands
 */
bot.command('captcha', captchaCommand())

// bot.action(/^settings=captcha&field=(\w+)/, async (ctx) => {
//   captcha[ctx.match[1]]
// })

// bot.entity(({ type }) => type === 'url', async (ctx) => {
//   // ctx.session.user
// })

bot.startPolling()
