const passport = require('../config/passport')
const authenticated = passport.authenticate('jwt', { session: false })
const { getUser } = require('../_helpers')

const authenticatedUser = (req, res, next) => {
  getUser(req).role === 'user' ? next() : res.status(403).json({ status: 'error', message: '無權限進入' })
}

const authenticatedAdmin = (req, res, next) => {
  getUser(req).role === 'admin' ? next() : res.status(403).json({ status: 'error', message: '無權限進入' })
}

module.exports = {
  authenticatedUser,
  authenticatedAdmin,
  authenticated,
  
}
