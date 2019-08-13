const { errorHandler } = require('@/helpers')

module.exports = () => async (ctx) => {
  switch (ctx.match[1]) {
    case 'delete':
      ctx.tg.deleteMessage(ctx.chat.id, ctx.update.callback_query.message.message_id)
      break
    case 'save':
      if (ctx.session.edit && ctx.session.new) {
        await ctx.database('groups')
          .update({ config: JSON.stringify(ctx.session.new) })
          .where({ id: Number(ctx.chat.id) })
          .catch(errorHandler)

        ctx.session.field = null
        ctx.session.new = null
        ctx.session.old = null
        ctx.session.messages.forEach((id) => {
          if (ctx.update.callback_query.message.message_id !== id) {
            ctx.tg.deleteMessage(ctx.chat.id, id)
          }
        })
        ctx.session.messages = [ctx.update.callback_query.message.message_id]
      }
      break
    case 'exit':
      if (ctx.session.edit) {
        ctx.session.field = null
        ctx.session.edit = null
        ctx.session.new = null
        ctx.session.old = null
        ctx.session.messages.forEach((id) => {
          ctx.tg.deleteMessage(ctx.chat.id, id)
        })
        ctx.session.messages = []
      }
      break
    default:
  }
}
