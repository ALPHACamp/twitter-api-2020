const {
  emitError
} = require('../helper')

module.exports = async socket => {
  try {
    console.log('觸發get notice')
  } catch (err) {
    emitError(socket, err)
  }
}
