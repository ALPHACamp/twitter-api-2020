// const passport = require('../config/passport')
// const authenticated = passport.authenticate('jwt', { session: false })

const { ensureAuthenticated, getUser } = require('../helpers/auth-helper')

const authenticated = (req, res, next) => {
  if (ensureAuthenticated(req)) {
    return next()
  }
  res.status(200).json({ status: 'success', message: 'Admin login successfully!' })
}

const authenticatedAdmin = (req, res, next) => {
  if (ensureAuthenticated(req)) {
    if (getUser(req).isAdmin) return next()
    res.status(200).json({ status: 'success', message: 'Admin login successfully!' })
  } else {
    res.status(401).json({ status: 'error', message: 'user is invalidated' })
  }
}

module.exports = {
  authenticated,
  authenticatedAdmin
}
