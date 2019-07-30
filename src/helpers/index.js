const { inspect } = require('util')

const debug = (data) => console.log(inspect(data, {
  showHidden: true,
  colors: true,
  depth: 10,
}))

const errorHandler = (error) => debug(error)

module.exports = {
  errorHandler,
  debug,
}
