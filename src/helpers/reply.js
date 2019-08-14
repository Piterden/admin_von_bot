const Markup = require('telegraf/markup')

const LIKE_BUTTON = '👍🏻'
const DISLIKE_BUTTON = '👎🏻'

const getExtra = () => Markup.inlineKeyboard([
  Markup.callbackButton(LIKE_BUTTON, 'reply_like=like_count'),
  Markup.callbackButton(DISLIKE_BUTTON, 'reply_like=dislike_count_3'),
]).extra()

const setExtra = (likeCount, dislikeCount) => Markup.inlineKeyboard([
  Markup.callbackButton(`${LIKE_BUTTON} ${likeCount}`,
    `reply_like=like_count_${likeCount}`),
  Markup.callbackButton(`${DISLIKE_BUTTON} ${dislikeCount}`,
    `reply_like=dislike_count_${dislikeCount}`),
]).extra()

module.exports = {
  getExtra,
  setExtra,
}
