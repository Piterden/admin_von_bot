const { errorHandler } = require('@/helpers')
const { setExtra } = require('@/helpers/reply')

const TABLE = 'likes'
module.exports = () => async (ctx) => {
  if (!ctx.test) ctx.test = 0
  ctx.test += 1
  const where = {
    chat_id: Number(ctx.chat.id),
    message_id: ctx.update.callback_query.message.message_id,
    user_id: ctx.update.callback_query.message.reply_to_message.chat.id,
    message: ctx.update.callback_query.message.reply_to_message.text,
  }
  const field = ctx.match[1].split(/_(.*?)+$/)[0]
  const affected = await ctx.database(TABLE)
    .increment(`${field}`)
    .where(where)
    .catch(errorHandler)
  if (affected === 0) {
    let likeCount = 0
    let dislikeCount = 0
    if (ctx.match[1].match('dis')) {
      dislikeCount += 1
    } else {
      likeCount += 1
    }
    await ctx.database(TABLE).insert({
      likes: likeCount,
      dislikes: dislikeCount,
      ...where,
    })
  }
  const { text } = ctx.update.callback_query.message
  const messageId = ctx.update.callback_query.message.message_id
  const replyMarkup = ctx.update.callback_query.message.reply_markup
  const inlineKeyboard = replyMarkup.inline_keyboard
  const [buttons] = inlineKeyboard
  const findRegex = /_(\d+)$/
  let like = 0
  let dislike = 0
  if (buttons[0].callback_data.match(findRegex)) {
    like = parseInt(buttons[0].callback_data.match(findRegex)[1], 10)
  }
  if (buttons[1].callback_data.match(findRegex)) {
    dislike = parseInt(buttons[1].callback_data.match(findRegex)[1], 10)
  }
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
