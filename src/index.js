require('dotenv').config()
require('module-alias/register')

const knex = require('knex')
const Telegraf = require('telegraf')

const { debug } = require('@/helpers')

// const knexConfig = require('@/../knexfile')

const { session } = Telegraf
const { BOT_NAME, BOT_TOKEN } = process.env

const bot = new Telegraf(BOT_TOKEN, { username: BOT_NAME })

// bot.context.db = knex(knexConfig)

bot.use(async (ctx, next) => {
  debug(ctx.update)
  next(ctx)
})

bot.on('sticker', async (ctx) => {
  setTimeout(() => {
    ctx.deleteMessage(ctx.update.message.message_id)
  }, 30000)
})

bot.startPolling()
