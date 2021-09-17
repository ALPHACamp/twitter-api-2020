const jwt = require('jsonwebtoken')
const { User } = require('../models')
const passport = require('../config/passport')
const helpers = require('../_helpers')
const ApiError = require('../utils/customError')

// use helpers.getUser(req) to replace req.user
const authenticated = (req, res, next) =>
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) {
      return next(new ApiError('AuthenticatedError', 401, 'Unauthorized'))
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
          new ApiError('AuthenticatedRoleError', 403, 'Permission denied')
        )
      }
    }
    return next()
  }
}

module.exports = { authenticated, authenticatedRole }
