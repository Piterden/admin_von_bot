const Markup = require('telegraf/markup')

const configMap = require('@/config')
const { errorHandler } = require('@/helpers')
const { settingsButtons } = require('@/buttons')

module.exports = () => async (ctx) => {
  await ctx.deleteMessage()

  const chatMember = await ctx.tg.getChatMember(ctx.chat.id, ctx.from.id)

  if (!['creator', 'administrator'].includes(chatMember.status)) {
    const { message_id: id } = await ctx.reply('Только админам можно править настройки в группах!')

    setTimeout(() => {
      ctx.tg.deleteMessage(ctx.chat.id, id)
    }, 2500)
    return
  }

  ctx.session.edit = 'captcha'

  const chat = await ctx.database('groups')
    .where({ id: Number(ctx.chat.id) })
    .first()
    .catch(errorHandler)
  let { config } = chat

  config = JSON.parse(config)
  ctx.session.old = config

  const buttons = settingsButtons(ctx)
  const { message_id: id } = await ctx.reply(
    `Текущий чат имеет следующие настройки капчи:
${Object.keys(configMap.captcha).map((key) => `
*${configMap.captcha[key].name}:*
_${config.captcha[key]}_`).join('\n')}

Выберите параметр для его изменения:`,
    {
      ...Markup.inlineKeyboard(buttons).extra(),
      parse_mode: 'Markdown',
    }
  )

  ctx.session.messages = ctx.session.messages || []
  ctx.session.messages.push(id)
}
