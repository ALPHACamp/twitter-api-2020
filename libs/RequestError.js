function RequestError(message) {
  this.name = 'error'
  this.message = message || 'Something error, please contact server maintainer'
  this.stack = (new Error()).stack
}

RequestError.prototype = Object.create(Error.prototype);
RequestError.prototype.constructor = RequestError;

module.exports = RequestError 