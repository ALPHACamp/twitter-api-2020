const passport = require('../config/passport')
const helpers = require('../_helpers')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        status: 'error',
        message: 'unauthorized'
      })
    } else if (user && user.role !== 'user') {
      return res.status(403).json({
        status: 'error',
        message: 'forbidden'
      })
    } 

    helpers.getUser(req) = user
    next()
  })(req, res, next)
}

const authenticatedAdmin = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        status: 'error',
        message: 'unauthorized'
      })
    } else if (user && user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'forbidden'
      })
    } 

    helpers.getUser(req) = user
    next()
  })(req, res, next)
}

module.exports = {
  authenticated,
  authenticatedAdmin
}
