function ReqError(message) {
  this.name = 'ReqError'
  this.message = message
}

// 繼承Error物件
ReqError.prototype = new Error()
ReqError.prototype.constructor = ReqError

// ReqError export
module.exports = ReqError