const hearsHandler = require('./hears')
const voiceHandler = require('./voice')
const replyHandler = require('./reply')
const stickerHandler = require('./sticker')
const animationHandler = require('./animation')
const newChatMemberHandler = require('./new-chat-member')
const leftChatMemberHandler = require('./left-chat-member')

module.exports = {
  hearsHandler,
  voiceHandler,
  replyHandler,
  stickerHandler,
  animationHandler,
  newChatMemberHandler,
  leftChatMemberHandler,
}
