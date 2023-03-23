const passport = require('../config/passport')
const helpers = require('../_helpers')
const authenticate = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) { return next(err) }
    if (!user) {
      if (info.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Your token has expired.' })
      } else {
        return res.status(401).json({ message: info.message })
      }
    }
    req.user = user
    return next()
  })(req, res, next)
}

const authenticateAdmin = (req, res, next) => {
  if (helpers.getUser(req) && helpers.getUser(req).role === 'admin') return next()
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}
module.exports = {
  authenticate,
  authenticateAdmin
}
