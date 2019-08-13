const hearsHandler = require('./hears')
const voiceHandler = require('./voice')
const stickerHandler = require('./sticker')
const animationHandler = require('./animation')
const newChatMemberHandler = require('./new-chat-member')
const leftChatMemberHandler = require('./left-chat-member')

module.exports = {
  hearsHandler,
  voiceHandler,
  stickerHandler,
  animationHandler,
  newChatMemberHandler,
  leftChatMemberHandler,
}
