const jwt = require('jsonwebtoken')
const { User } = require('../models')
const passport = require('../config/passport')
const helpers = require('../_helpers')

// use helpers.getUser(req) to replace req.user
const authenticated = passport.authenticate('jwt', { session: false })

// authenticatedRole('user') to verify req is user
// authenticatedRole('admin') to verify req is admin
const authenticatedRole = (role) => {
  return (req, res, next) => {
    if (helpers.getUser(req).role !== role) {
      return res.json({ status: 'error', message: 'Permission denied' })
    }
    return next()
  }
}

module.exports = { authenticated, authenticatedRole }
