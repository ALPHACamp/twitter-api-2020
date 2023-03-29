const passport = require('../config/passport')
const { AuthError, AutherError } = require('../helpers/errorInstance')
const helper = require('../_helpers')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) next(new AuthError('非法token~~~'))
    req.user = user
    next()
  })(req, res, next)
}
const authenticatedAdmin = (req, res, next) => {
  if (helper.getUser(req)?.role === 'admin') return next()

  return next(new AutherError('他不是管理員！'))
}
module.exports = {
  authenticated,
  authenticatedAdmin
}
