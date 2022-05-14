const passport = require('../config/passport')
const { getUser } = require('../_helpers')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ status: 'error', message: 'Unauthorized' })
    req.user = user
    return next()
  })(req, res, next)
}

const authenticatedUser = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, () => {
    req.user = getUser(req)
    if (req.user && req.user.role !== 'admin') return next()
    return res.status(403).json({ status: 'error', message: 'Permission denied' })
  })(req, res, next)
}

module.exports = {
  authenticated,
  authenticatedUser
}
