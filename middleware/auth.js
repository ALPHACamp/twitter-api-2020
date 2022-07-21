const passport = require('../config/passport')
const { StatusCodes } = require('http-status-codes')
const helpers = require('../_helpers')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (error, user) => {
    if (error) return next(error)
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: 'error',
        message: '無使用者權限'
      })
    }
    req.user = user
    next()
  })(req, res, next)
}

const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req) && helpers.getUser(req).role === 'admin') return next()
  return res.status(StatusCodes.FORBIDDEN).json({
    status: 'error',
    message: '無管理者權限'
  })
}

module.exports = {
  authenticated,
  authenticatedAdmin
}
