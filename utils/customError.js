class ApiError extends Error {
  constructor(name, statusCode, message) {
    super(message)
    this.name = name
    this.statusCode = statusCode
  }
}

module.exports = ApiError
