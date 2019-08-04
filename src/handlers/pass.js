module.exports = () => async (ctx) => {
  if (!ctx.session.restricted || ctx.from.id !== Number(ctx.match[1])) {
    return ctx.answerCbQuery('Не ты, балда!!!')
  }

  if (ctx.session.timeoutToKick) {
    clearTimeout(ctx.session.timeoutToKick)
    ctx.session.timeoutToKick = null
  }

  await ctx.restrictChatMember(
    ctx.from.id,
    {
      can_send_messages: true,
      can_send_media_messages: true,
      can_send_other_messages: true,
      can_add_web_page_previews: true,
    }
  )

  await ctx.deleteMessage()

  return ctx.answerCbQuery('Правильно! Добро пожаловать!')
}
