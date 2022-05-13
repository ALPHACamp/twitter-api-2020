const { getUser } = require('../_helpers')
const passport = require('../config/passport')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ status: 'error', message: 'unauthorized' })
    if (user) {
    req.user = user.dataValues
    }
    return next()
  })(req, res, next)
}

const authenticatedUser = (req, res, next) => {
  getUser(req).role === 'user' ? next() : res.status(403).json({ status: 'error', message: 'account is not exist' })
}

const authenticatedAdmin = (req, res, next) => {
  getUser(req).role === 'admin' ? next() : res.status(403).json({ status: 'error', message: 'account is not exist' })
}

module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticatedUser
}