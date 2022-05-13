const helpers = require('../_helpers')
const passport = require('../config/passport')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ status: 'error', message: 'unauthorized' })
    if (user) {
      req.user = user
    }
    return next()
  })(req, res, next)
}

const authenticatedUser = (req, res, next) => {
  // console.log(req.user.toJSON())
  if (req.user) {
    if (req.user.role === 'admin') throw new Error('account is not exist')
    return next()
  } else {
    res.status(403).json({ status: 'error', message: 'account is not exist' })
  }
}

// const authenticatedUser = (req, res, next) => {
//   req.user ? next() : res.status(403).json({ status: 'error', message: 'account is not exist' })
// }

const authenticatedAdmin = (req, res, next) => {
  helpers.getUser(req).role === 'admin' ? next() : res.status(403).json({ status: 'error', message: 'account is not exist' })
}

module.exports = {
  authenticated,
  authenticatedUser,
  authenticatedAdmin
}