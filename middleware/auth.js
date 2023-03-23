const passport = require('../config/passport')
const helpers = require('../_helpers')

// use helpers.getUser(req) to replace req.user
const authenticatedUser = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ status: 'error', message: 'JWT token failed!' })

    req.user = user

    if (helpers.getUser(req) && helpers.getUser(req).role !== 'admin') return next()
    return res.status(403).json({ status: 'error', message: 'Permission denied.' })
  })(req, res, next)
}

const authenticatedAdmin = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ status: 'error', message: 'JWT token failed!' })

    req.user = user

    if (helpers.getUser(req) && helpers.getUser(req).role === 'admin') return next()
    return res.status(403).json({ status: 'error', message: 'Permission denied.' })
  })(req, res, next)
}

module.exports = {
  authenticatedUser,
  authenticatedAdmin
}
