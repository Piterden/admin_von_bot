const { inspect } = require('util')

// eslint-disable-next-line no-console
const debug = (data) => console.log(inspect(data, {
  showHidden: true,
  colors: true,
  depth: 10,
}))

const errorHandler = (error) => debug(error)

const render = (string) => {
  string.match(/{(\w*)}/g)
}

const makeUserMention = ({
  id,
  username,
  first_name: firstName,
  last_name: lastName,
}) => username
  ? `@${username}`
  : `[${firstName || lastName}](tg://user?id=${id})`

module.exports = {
  makeUserMention,
  errorHandler,
  render,
  debug,
}
