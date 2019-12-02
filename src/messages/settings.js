module.exports = (ctx, configMap, config) => `Текущий чат имеет следующие настройки для ${ctx.session.edit}:
${Object.keys(configMap[ctx.session.edit]).map((key) => `
*${configMap[ctx.session.edit][key].name}:*
_${config && config[ctx.session.edit]
    ? config[ctx.session.edit][key]
    : configMap[ctx.session.edit][key].default}_`).join('\n')}

Выберите параметр для его изменения:`
