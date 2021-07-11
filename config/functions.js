const validator = require('validator')

module.exports = {
  randomDate: (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  }
}
