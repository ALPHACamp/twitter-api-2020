const passport = require('../config/passport')
const { getUser } = require('../_helpers')

const authenticated = (req, res, next) => {
  // if (req.isAuthenticated)
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || user) {
      return res.status(200).json({
        status: 'error',
        message: 'Unauthorized'
      })
    }
    req.user = user
    return next()
  })(req, res, next)
}

const authenticatedUser = (req, res, next) => {
  req.user = getUser(req)
  passport.authenticate('jwt', { session: false}, (err, user) => {
    if (req.user && req.user.role !== 'admin') return next()
  })
  return res.status(200).json({
    status: 'error',
    message: 'Permission denied',
  })
}

// Angela: authenticated Admin


module.exports = {
  authenticated,
  authenticatedUser
}