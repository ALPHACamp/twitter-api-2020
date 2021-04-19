const helpers = require('../_helpers')
const passport = require('../config/passport')

module.exports = {
  authenticated: (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'No jwt token'
        })
      }
      req.user = user
      return next()
    })(req, res, next)
  },
  authenticatedAdmin: (req, res, next) => {
    if (helpers.getUser(req)) {
      if (helpers.getUser(req).isAdmin) {
        return next()
      }
      return res.json({ status: 'error', message: 'permission denied' })
    } else {
      return res.json({ status: 'error', message: 'permission denied' })
    }
  }
}
