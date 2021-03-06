const Markup = require('telegraf/markup')

const configMap = require('@/config')

module.exports = (ctx) => {
  const config = ctx.session.new || ctx.session.old
  const buttons = Object.keys(config[ctx.session.edit]).map((key) => (
    Markup.callbackButton(
      configMap[ctx.session.edit][key].name,
      `settings=captcha&field=${key}`
    )
  )).reduce((acc, cur, idx) => {
    const index = parseInt(idx / 2, 10)

    acc[index] = acc[index] || []
    acc[index].push(cur)

    return acc
  }, [])

  buttons.push([
    Markup.callbackButton('Сохранить', 'action=save', !ctx.session.new),
    Markup.callbackButton('Выход', 'action=exit'),
  ])

  return buttons
}
