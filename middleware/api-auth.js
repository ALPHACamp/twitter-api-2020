const passport = require('../config/passport')

const authenticated = passport.authenticate('jwt', { session: false })

const authenticatedAdmin = (req, res, next) => {
  const idAdmin = req.user.toJSON().Identity.identity
  if (req.user && idAdmin) return next()
  return res.status(403).json({ status: 'error', message: '不允許訪問' })
}

module.exports = {
  authenticated,
  authenticatedAdmin
}
