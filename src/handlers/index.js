const kickHandler = require('./kick')
const passHandler = require('./pass')
const voiceHandler = require('./voice')
const stickerHandler = require('./sticker')
const animationHandler = require('./animation')
const newChatMemberHandler = require('./new-chat-member')
const leftChatMemberHandler = require('./left-chat-member')

module.exports = {
  kickHandler,
  passHandler,
  voiceHandler,
  stickerHandler,
  animationHandler,
  newChatMemberHandler,
  leftChatMemberHandler,
}
