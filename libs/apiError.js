class apiError {
  constructor(code, message) {
    this.code = code
    this.message = message
  }

  static badRequest(code, msg) {
    return new apiError(code, msg)
  }
}

module.exports = apiError