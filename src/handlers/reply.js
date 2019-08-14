const { getExtra } = require('@/helpers/reply')

module.exports = () => (ctx) => {
  if (ctx.message.reply_to_message) {
    const { text } = ctx.message
    if (text === '+') {
      const replyToMessageId = ctx.message.reply_to_message.message_id
      ctx.deleteMessage(ctx.message.message_id)
      const extra = getExtra()
      extra.reply_to_message_id = replyToMessageId
      ctx.tg.sendMessage(
        ctx.chat.id,
        text,
        extra,
      )
    }
  }
}
