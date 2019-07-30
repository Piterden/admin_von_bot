const Markup = require('telegraf/markup')

const { debug } = require('@/helpers')

module.exports = () => async (ctx) => {
  ctx.deleteMessage(ctx.message.message_id)

  const extra = Markup.inlineKeyboard([
    Markup.callbackButton('Delete', 'action=delete'),
  ]).extra()

  if (ctx.message.reply_to_message) {
    extra.reply_to_message_id = ctx.message.reply_to_message.message_id
    debug(extra)
  }

  ctx.tg.sendSticker(
    ctx.chat.id,
    ctx.message.sticker.file_id,
    extra,
  )
}
