const passHandler = require('./pass')
const voiceHandler = require('./voice')
const stickerHandler = require('./sticker')
const newChatMemberHandler = require('./new-chat-member')
const leftChatMemberHandler = require('./left-chat-member')

module.exports = {
  passHandler,
  voiceHandler,
  stickerHandler,
  newChatMemberHandler,
  leftChatMemberHandler,
}
