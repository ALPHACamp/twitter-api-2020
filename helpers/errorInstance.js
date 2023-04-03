class ReqError extends Error {
  constructor (message) {
    super(message)
    this.status = 400
    this.name = 'Bad Request'
  }
}
class AuthError extends Error {
  constructor (message, statusCode) {
    super(message)
    this.status = 401
    this.name = 'Unauthorized'
  }
}
class AutherError extends Error {
  constructor (message, statusCode) {
    super(message)
    this.status = 403
    this.name = 'Forbidden'
  }
}
class RouteError extends Error {
  constructor (message, statusCode) {
    super(message)
    this.status = 404
    this.name = ' Not Found'
  }
}
module.exports = { ReqError, AuthError, AutherError, RouteError }
