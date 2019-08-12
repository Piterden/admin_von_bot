module.exports = () => async (ctx) => {
  switch (ctx.match[1]) {
    case 'delete':
      ctx.tg.deleteMessage(ctx.chat.id, ctx.update.callback_query.message.message_id)
      break
    default:
  }
}
