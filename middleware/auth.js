const passport = require('../config/passport')
const helpers = require('../_helpers')
const jwt = require('jsonwebtoken')
const { User } = require('../models')

const authenticated = (req, res, next) => {
  // if (req.isAuthenticated)
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized'
      })
    }
    req.user = user
    return next()
  }) (req, res, next)
}

const authenticatedUser = (req, res, next) => {
  req.user = helper.getUser(req)
  if (req.user && req.user.role === '') return next()
  return res.status(403).json({
    status: 'error',
    message: 'Permission denied'
  })
}

// Angela: authenticated Admin



module.exports = {
  authenticated,
  authenticatedUser
}
