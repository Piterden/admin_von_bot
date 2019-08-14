const Markup = require('telegraf/markup')

const LIKE_BUTTON = '👍🏻'
const DISLIKE_BUTTON = '👎🏻'
const ACTION = 'likes'

const getExtra = () => Markup.inlineKeyboard([
  Markup.callbackButton(LIKE_BUTTON, `${ACTION}=likes`),
  Markup.callbackButton(DISLIKE_BUTTON, `${ACTION}=dislikes`),
]).extra()

const setExtra = (likeCount, dislikeCount) => Markup.inlineKeyboard([
  Markup.callbackButton(`${LIKE_BUTTON} ${likeCount}`,
    `${ACTION}=likes_${likeCount}`),
  Markup.callbackButton(`${DISLIKE_BUTTON} ${dislikeCount}`,
    `${ACTION}=dislikes_${dislikeCount}`),
]).extra()

module.exports = {
  getExtra,
  setExtra,
}
