module.exports = () => async (ctx) => {
  setTimeout(() => {
    ctx.deleteMessage(ctx.update.message.message_id)
  }, 30000)
}
