const passport = require('../config/passport')
const authenticated = passport.authenticate('jwt', { session: false })
const authenticatedAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) return next()
  return res.status(401).json({ status: 'error', message: 'unauthorized' })
}
module.exports = {
  authenticated,
  authenticatedAdmin
}
