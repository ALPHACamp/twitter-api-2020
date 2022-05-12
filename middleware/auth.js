const passport = require('../config/passport')
const helpers = require('../helpers/auth-helpers')
const jwt = require('jsonwebtoken')
const { User } = require('../models')

const authenticated = (req, res, next) => {
  // if (req.isAuthenticated)
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Permission denied'
      })
    }
    req.user = user
    return next()
  }) (req, res, next)
}

authenticatedUser: (req, res, next) => {
  if (req.user && req.user.role === '') return next()
  return res.status(401).json({
    status: 'error',
    message: 'Permission denied',
  })
}

// Angela: authenticated Admin



module.exports = {
  authenticated,
  authenticatedUser
}
