class ApiError extends Error {
  constructor(errType, statusCode, message) {
    super(message)
    this.errType = errType
    this.statusCode = statusCode
  }
}

module.exports = ApiError
