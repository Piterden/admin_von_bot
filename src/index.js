require('dotenv').config()
require('module-alias/register')

const knex = require('knex')
const Telegraf = require('telegraf')

const knexConfig = require('@/../knexfile')
const { captchaCommand, startCommand, statsCommand } = require('@/commands')
const { userMiddleware, debugMiddleware } = require('@/middlewares')
const {
  kickAction,
  passAction,
  actionsAction,
  editSettingAction,
} = require('@/actions')
const {
  hearsHandler,
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
bot.hears(/[\S\s]*/, hearsHandler())
bot.on('voice', voiceHandler())
bot.on('sticker', stickerHandler())
bot.on('animation', animationHandler())
bot.on('new_chat_members', newChatMemberHandler())
bot.on('left_chat_member', leftChatMemberHandler())

/**
 * Actions
 */
bot.action(/^kick=(\d+)&index=(\d+)/, kickAction())
bot.action(/^pass=(\d+)&index=(\d+)/, passAction())
bot.action(/^action=(\w+)/, actionsAction())
bot.action(/^settings=(\w+)&field=(\w+)/, editSettingAction())

/**
 * Commands
 */
bot.start(startCommand())
bot.command('captcha', captchaCommand())
bot.command('stats', statsCommand())

/**
 * Run
 */
bot.startPolling()
