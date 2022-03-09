const passport = require('../config/passport')
const helpers = require('../_helpers')

module.exports = {
  authenticated: (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
      if (err || !user) {
        return res
          .status(401)
          .json({
            status: 'error',
            message: 'No JWT token'
          })
      }
      req.user = user
      next()
    })(req, res, next)
  },

  authenticatedAdmin: (req, res, next) => {
    const user = helpers.getUser(req)
    if (user && user.role === 'admin') return next()

    return res
      .status(403)
      .json({
        status: 'error',
        message: 'permission denied'
      })
  }
}
