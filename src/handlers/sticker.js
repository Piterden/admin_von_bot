const Markup = require('telegraf/markup')

const { debug } = require('@/helpers')

const DELAY = 90000

module.exports = () => async (ctx) => {
  ctx.deleteMessage(ctx.message.message_id)

  const extra = Markup.inlineKeyboard([
    Markup.callbackButton(`From: ${ctx.from.first_name}`, 'action=info'),
    Markup.callbackButton('Delete', 'action=delete'),
  ]).extra()

  if (ctx.message.reply_to_message) {
    extra.reply_to_message_id = ctx.message.reply_to_message.message_id
    debug(extra)
  }

  const message = await ctx.tg.sendSticker(
    ctx.chat.id,
    ctx.message.sticker.file_id,
    extra,
  )

  // const step = 10000

  // for (let timeout = step; timeout < DELAY; timeout += step) {
  //   setTimeout(() => {
  //     ctx.tg.editMessage
  //   }, timeout)
  // }

  setTimeout(() => {
    ctx.deleteMessage(message.message_id)
  }, DELAY)
}
