const passport = require('../config/passport')

const authenticated = passport.authenticate('jwt', { session: false })
const authenticatedAdmin = (req, res, next) => {
  if (req.user?.identity_id) return next()
  return res.status(403).json({ status: 'error', message: '不允許訪問' })
}

module.exports = {
  authenticated,
  authenticatedAdmin
}
