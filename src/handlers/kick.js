module.exports = () => async (ctx) => {
  const [, id] = ctx.match

  if (!ctx.session.restricted || ctx.from.id !== Number(id)) {
    return ctx.answerCbQuery('Не ты, балда!!!')
  }
  ctx.session.restricted = null

  if (ctx.session.timeoutToKick) {
    clearTimeout(ctx.session.timeoutToKick)
    ctx.session.timeoutToKick = null
  }

  await ctx.deleteMessage()
  ctx.answerCbQuery('Неправильно! Попробуйте через минуту!')

  await ctx.tg.kickChatMember(ctx.chat.id, id)

  setTimeout(() => {
    ctx.tg.unbanChatMember(ctx.chat.id, id)
  }, 40000)

  return true
}
