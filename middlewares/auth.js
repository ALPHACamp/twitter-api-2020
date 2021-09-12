const jwt = require('jsonwebtoken')
const { User } = require('../models')
const passport = require('../config/passport')
const helpers = require('../_helpers')

// use helpers.getUser(req) to replace req.user
const authenticated = (req, res, next) =>
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' })
    }
    req.user = user.dataValues

    return next()
  })(req, res, next)

// authenticatedRole('user') to verify req is user
// authenticatedRole('admin') to verify req is admin
const authenticatedRole = (role = 'user') => {
  return (req, res, next) => {
    if (helpers.getUser(req).role) {
      if (helpers.getUser(req).role !== role) {
        return next(
          res
            .status(401)
            .json({ status: 'error', message: 'Permission denied' })
        )
      }
    }
    return next()
  }
}

module.exports = { authenticated, authenticatedRole }
