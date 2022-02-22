const helpers = require('../helpers/auth-helpers')
const passport = require('../config/passport') // 引入 passport

const authenticated = passport.authenticate('jwt', { session: false })

const authenticatedAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) return next()
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}

const authenticatedNoAdmin = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) return next()
    return res.status(403).json({ status: 'error', message: 'this account is admin' })
}

module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticatedNoAdmin
}
