const passport = require('../config/passport')
const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json('unauthorized')
    req.user = user
    if (req.user.role === 'admin') return res.status(403).json('permission denied')
    next()
  })(req, res, next)
}

const authenticatedAdmin = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json('unauthorized')
    req.user = user
    if (req.user.role === 'user') return res.status(403).json('permission denied')
    next()
  })(req, res, next)
}
module.exports = { authenticated, authenticatedAdmin }
