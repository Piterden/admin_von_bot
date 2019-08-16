const { errorHandler, makeUserMention } = require('@/helpers')

module.exports = () => async (ctx, next) => {
  if (!ctx.message.reply_to_message) {
    return next(ctx)
  }
  await ctx.deleteMessage(ctx.message.message_id)

  const value = Number(ctx.message.text.charAt(0) + ctx.message.text.length)
  const row = await ctx.database('likes')
    .where({
      chat_id: ctx.chat.id,
      message_id: ctx.message.reply_to_message.message_id,
      to_id: ctx.message.reply_to_message.from.id,
      from_id: ctx.from.id,
    })
    .first()
    .catch(errorHandler)

  if (row) {
    return next(ctx)
  }

  await ctx.database('likes')
    .insert({
      chat_id: ctx.chat.id,
      message_id: ctx.message.reply_to_message.message_id,
      to_id: ctx.message.reply_to_message.from.id,
      from_id: ctx.from.id,
      message: JSON.stringify(ctx.message.reply_to_message),
      value,
    })
    .catch(errorHandler)

  const fromUser = makeUserMention(ctx.from)
  const toUser = makeUserMention(ctx.from)
  const { message_id: messageId } = await ctx.reply(
    `${fromUser} оценил сообщение от ${toUser}`,
  )

  setTimeout(() => {
    ctx.deleteMessage(messageId)
  }, 5000)

  return next(ctx)
}
