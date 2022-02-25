const passport = require('../config/passport')

// const authenticated = (req, res, next) => {
//   passport.authenticate('jwt', { session: false }, (err, user) => {
//     if (err || !user) return res.status(401).json({ status: 'error', message: 'Unauthorized' })
//     req.user = user
//     next()
//   })(req, res, next)
// }
const authenticated = passport.authenticate('jwt', { session: false })

const authenticatedAdmin = (req, res, next) => {
  if (req.user?.role === 'admin') return next()
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}

module.exports = {
  authenticated,
  authenticatedAdmin
}