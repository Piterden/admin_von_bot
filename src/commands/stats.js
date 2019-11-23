const knex = require('knex')
const { errorHandler } = require('@/helpers')

module.exports = () => async (ctx) => {
  const chatMember = await ctx.tg.getChatMember(ctx.chat.id, ctx.from.id)

  if (!['creator', 'administrator'].includes(chatMember.status)) {
    const { message_id: id } = await ctx.reply('Доступно только админам!')

    setTimeout(() => {
      ctx.tg.deleteMessage(ctx.chat.id, id)
    }, 2500)
    return
  }

  const stats = await ctx.database('actions')
    .select('action', 'button', knex.raw('count(*) as cnt'))
    .where({ id: Number(ctx.chat.id) })
    .groupBy(['action', 'button'])
    .catch(errorHandler)

  const text = stats.map(row => `${row.action} ${row.button ? row.button : ''} ${row.cnt}`).join('\n')
  await ctx.reply(text)
}
