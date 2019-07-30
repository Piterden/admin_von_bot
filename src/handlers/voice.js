module.exports = () => async (ctx) => {
  await ctx.deleteMessage(ctx.message.message_id)
}
