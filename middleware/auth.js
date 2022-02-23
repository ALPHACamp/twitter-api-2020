const passport = require('../config/passport')
const { getUser } = require('../_helpers')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    const userData = user.toJSON()
    if (err || !user) return res.status(401).json({ status: 'error', message: 'unauthorized' })
    if (userData.role === 'admin') return res.status(401).json({ status: 'error', message: 'permission denied' })
    req.user = userData
    next()
  })(req, res, next)
}

const authenticatedAdmin = (req, res, next) => {
  if (getUser(req) && getUser(req).role === 'admin') return next()
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}
module.exports = {
  authenticated,
  authenticatedAdmin
}