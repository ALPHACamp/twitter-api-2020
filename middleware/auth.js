const { getUser } = require('../_helpers')
const passport = require('../config/passport')
const authenticated = passport.authenticate('jwt', { session: false })

const authenticatedUser = (req, res, next) => {
  getUser(req).role === 'user' ? next() : res.status(403).json({ status: 'error', message: 'account is not exist'})
}

const authenticatedAdmin = (req, res, next) => {
  getUser(req).role === 'admin' ? next() : res.status(403).json({ status: 'error', message: 'account is not exist' })
}
module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticatedUser
}