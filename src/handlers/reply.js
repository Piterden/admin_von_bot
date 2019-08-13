const Markup = require('telegraf/markup');

const { debug } = require('@/helpers');

const LIKE_BUTTON = '👍🏻'
const DISLIKE_BUTTON = '👎🏻'
module.exports = () => ctx => {
  if (ctx.message.reply_to_message) {
    const { text } = ctx.message
    const search = ['+', LIKE_BUTTON]
    const regex = new RegExp('\\b' + search.join('\\b|\\b') + '\\b')
    if (regex.test(text.split('👎🏻'))) {
      const replyToMessageId = ctx.message.reply_to_message.message_id
      ctx.deleteMessage(ctx.message.message_id)

      const extra = Markup.inlineKeyboard([
        Markup.callbackButton(LIKE_BUTTON, 'action=reply_like'),
        Markup.callbackButton(DISLIKE_BUTTON, 'action=reply_dislike'),
      ]).extra()

      extra.reply_to_message_id = replyToMessageId
      debug(extra)
      return ctx.tg.sendMessage(
        ctx.chat.id,
        text,
        extra,
      )
    }
  }
};
