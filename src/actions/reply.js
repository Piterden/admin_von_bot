const { errorHandler } = require('@/helpers')
const { setExtra } = require('@/helpers/reply')

module.exports = () => async (ctx) => {
  if (!ctx.test) ctx.test = 0
  ctx.test += 1
  const where = {
    chat_id: Number(ctx.chat.id),
    message_id: ctx.update.callback_query.message.message_id,
    username: ctx.update.callback_query.message.reply_to_message.chat.username,
    text: ctx.update.callback_query.message.reply_to_message.text,
  }
  const field = ctx.match[1].split(/_(.*?)+$/)[0]
  await ctx.database('reply_likes')
    .increment(`${field}_count`)
    .where(where)
    .then((aff) => {
      if (aff === 0) {
        let likeCount = 0
        let dislikeCount = 0
        if (ctx.match[1].match('dis')) {
          dislikeCount += 1
        } else {
          likeCount += 1
        }
        ctx.database('reply_likes').insert({
          like_count: likeCount,
          dislike_count: dislikeCount,
          ...where,
        })
      }
    })
    .catch(errorHandler)

  const { text } = ctx.update.callback_query.message
  const messageId = ctx.update.callback_query.message.message_id
  const replyMarkup = ctx.update.callback_query.message.reply_markup
  const inlineKeyboard = replyMarkup.inline_keyboard
  const [buttons] = inlineKeyboard
  const findRegex = /count_(.*?)$/
  let like = parseInt(buttons[0].callback_data.match(findRegex)[1], 10)
  let dislike = parseInt(buttons[1].callback_data.match(findRegex)[1], 10)
  like = !Number.isNaN(like) ? like : 0
  dislike = !Number.isNaN(dislike) ? dislike : 0
  if (ctx.match[1].match('dis')) {
    dislike += 1
  } else {
    like += 1
  }
  const replyToMessageId = ctx.update.callback_query.message.reply_to_message.message_id
  const extra = setExtra(like, dislike)
  extra.reply_to_message_id = replyToMessageId
  ctx.tg.editMessageText(
    ctx.chat.id,
    messageId,
    undefined,
    text,
    extra,
  )
}
