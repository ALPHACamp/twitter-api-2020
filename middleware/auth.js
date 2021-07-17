const passport = require('passport')
const helper = require('../_helpers')
module.exports = {
  authenticated: (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
      if (!user) {
        return res
          .status(403)
          .json({ status: 'error', message: 'Permission is denied.' })
      }
      req.user = user
      return next()
    })(req, res, next)
  },
  authenticatedAdmin: (req, res, next) => {
    req.user = helper.getUser(req)
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Permission is denied, only Administrator can visit.'
      })
    }
    return next()
  },
  authenticatedUser: (req, res, next) => {
    req.user = helper.getUser(req)
    if (req.user.role == 'user' || !req.user.role) {
      return next()
    }
    return res.status(403).json({
      status: 'error',
      message: 'Permission is denied, only User can visit.'
    })
  },
  authenticatedSocket: (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
      if (!user) {
        return next('Permission is denied')
      }
      req.user = user
      return next()
    })(req, res, next)
  }
}
