const passport = require('../config/passport')
const helpers = require('../_helpers')
const createError = require('http-errors')
const authenticate = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) next(err)
    if (!user) next(createError(401, 'Your token is invalid.'))
    req.user = user
    return next()
  })(req, res, next)
}

const authenticateRole = role => (req, res, next) => {
  if (helpers.getUser(req) && helpers.getUser(req).role === role) return next()
  return next(createError(403, 'permission denied.'))
}
module.exports = {
  authenticate,
  authenticateRole
}
