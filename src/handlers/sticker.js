const Markup = require('telegraf/markup')

module.exports = () => async (ctx) => {
  ctx.deleteMessage(ctx.message.message_id)
  ctx.tg.sendSticker(
    ctx.chat.id,
    ctx.message.sticker.file_id,
    Markup.inlineKeyboard([
      Markup.callbackButton('Delete', 'action=delete'),
    ]).extra(),
  )
}
