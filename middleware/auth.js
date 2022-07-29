const helpers = require('../_helpers')
const passport = require('../config/passport')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ status: 'Error', message: 'Unauthorized. Please login first.' })
    if (user) req.user = user
    next()
  })(req, res, next)
}

const authUser = (req, res, next) => {
  if (helpers.getUser(req)?.role === 'user') return next()
  return res.status(403).json({
    status: 'error',
    message: 'permission denied: need permission of user'
  })
}

const authAdmin = (req, res, next) => {
  if (helpers.getUser(req)?.role === 'admin') return next()
  return res.status(403).json({
    status: 'error',
    message: 'permission denied: need permission of admin'
  })
}

module.exports = {
  authenticated,
  authUser,
  authAdmin
}
