module.exports = (ctx, configMap) => {
  const [, setting, field] = ctx.match
  const fieldConfig = configMap[setting][field]

  let message = `Настройка: *${setting}*
Параметр: *${field}*
Тип: *${fieldConfig.type.name}*

_${fieldConfig.description}_

По умолчанию: ${fieldConfig.default} _${fieldConfig.unit}_

Значение: ${ctx.session.new && ctx.session.new[setting] && ctx.session.new[setting][field] &&
  ctx.session.new[setting][field] !== ctx.session.old[setting][field]
    ? `~${ctx.session.old[setting][field]}~ ${ctx.session.new[setting][field]}`
    : ctx.session.old[setting][field]} _${fieldConfig.unit || ''}_`

  if (fieldConfig.type.name === 'Number') {
    message += `
Введите число`

    if (fieldConfig.min) {
      message += ` от ${fieldConfig.min}`
    }

    if (fieldConfig.max) {
      message += ` до ${fieldConfig.max}`
    }

    if (fieldConfig.min || fieldConfig.max) {
      message += '.'
    }
  }

  if (fieldConfig.type.name === 'String') {
    message += `
Введите текст`

    if (fieldConfig.min) {
      message += ` от ${fieldConfig.min}`
    }

    if (fieldConfig.max) {
      message += ` до ${fieldConfig.max}`
    }

    if (fieldConfig.min || fieldConfig.max) {
      message += ' символов.'
    }
  }

  if (fieldConfig.type.name === 'Array') {
    message += `
Вводите значения, каждое с новой строки`

    if (fieldConfig.min) {
      message += `, минимум ${fieldConfig.min}`
    }

    if (fieldConfig.max) {
      message += `, максимум ${fieldConfig.max}`
    }

    if (fieldConfig.max || fieldConfig.min) {
      message += ' значений.'
    }
  }

  return message
}
