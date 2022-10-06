const passport = require('../config/passport')
const helpers = require('../_helpers')

const authenticated = passport.authenticate('jwt', { session: false })

const authenticatedAdmin = (req, res, next) => {
  req.user = helpers.getUser(req)
  if (req.user && req.user.role === 'admin') return next()
  return res.status(403).json({ status: 'error', message: 'Permission denied.' })
}

const authenticateUser = (req, res, next) => {
  req.user = helpers.getUser(req)
  if (req.user && req.user.role !== 'admin') return next()
  return res.status(403).json({ status: 'error', message: 'Permission denied.' })
}


module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticateUser
}