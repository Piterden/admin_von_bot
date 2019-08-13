module.exports = (ctx) => `Текущий чат имеет следующие настройки для ${ctx.session.edit}:

\`\`\`
${JSON.stringify(ctx.session.new || ctx.session.old, null, '  ')}
\`\`\`

Выберите параметр для его изменения:`
