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
    req.user = { ...user.dataValues }
    next()
  })(req, res, next)
}

const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req) && helpers.getUser(req).role === 'admin') return next()
  } else {
    return res.status(403).json({ status: 'error', message: 'Permission denied!' })
  } return res.status(403).json({ status: 'error', message: 'Permission denied!' })
}

module.exports = {
  authenticated,
  authenticatedAdmin
}
