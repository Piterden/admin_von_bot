module.exports = () => async (ctx) => {
  setTimeout(() => {
    ctx.deleteMessage()
  }, 30000)
}
