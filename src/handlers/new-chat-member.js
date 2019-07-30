const Markup = require('telegraf/markup')

const { errorHandler } = require('@/helpers')

const { BOT_NAME } = process.env
const CAPTCHA_TIMEOUT = 300000

module.exports = () => async (ctx) => {
  const date = new Date()

  if (ctx.message.new_chat_member.username === BOT_NAME) {
    const [chat] = await ctx.database('groups')
      .where({ id: Number(ctx.chat.id) })
      .catch(errorHandler)

    if (chat) {
      const diff = Object.keys(ctx.chat).reduce((acc, key) => {
        if (key === 'id') {
          chat[key] = Number(chat[key])
          return acc
        }
        if (typeof ctx.chat[key] === 'boolean') {
          chat[key] = Boolean(chat[key])
        }
        if (ctx.chat[key] !== chat[key]) {
          acc[key] = ctx.chat[key]
        }
        return acc
      }, {})

      if (Object.keys(diff).length > 0) {
        await ctx.database('groups')
          .where({ id: Number(chat.id) })
          .update({ ...diff, active: true, updated_at: date })
          .catch(errorHandler)
      }
    } else {
      await ctx.database('groups')
        .insert({
          ...ctx.chat,
          active: true,
          config: JSON.stringify({}),
          created_at: date,
        })
        .catch(errorHandler)
    }
    return
  }

  if (!ctx.message.new_chat_member.is_bot) {
    const { id, username } = ctx.message.new_chat_member

    ctx.session.restricted = await ctx.restrictChatMember(id, {
      can_send_messages: false,
      can_send_media_messages: false,
      can_send_other_messages: false,
      can_add_web_page_previews: false,
    })

    const captcha = await ctx.reply(
      `Привет, @${username || ''}, нажми на кнопу, чтобы начать общение.`,
      Markup.inlineKeyboard([
        Markup.callbackButton('Кнопа', `pass=${id}`),
      ]).extra()
    )

    ctx.session.timeoutToKick = setTimeout(() => {
      ctx.session.timeoutToKick = null
      ctx.kickChatMember(id)
      ctx.deleteMessage(captcha.message_id)
    }, CAPTCHA_TIMEOUT)

    // await ctx.database('users_groups')
    //   .insert({
    //     user_id: id,
    //     group_id: ctx.chat.id,
    //     trusted: false,
    //     created_at: date,
    //   })
    //   .catch(errorHandler)
  }

  setTimeout(() => {
    ctx.deleteMessage(ctx.message.message_id)
  })
}
