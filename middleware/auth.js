const passport = require('../config/passport')
const helpers = require('../_helpers')

module.exports = {
  // 身份認證
  authenticated: (req, res, next) => {
    //   passport.authenticate('jwt', { session: false })
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) {
        return next(err)
      }
      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'Authenticated failed!',
        })
      }
      req.user = user
      return next()
    })(req, res, next)
  },

  // Admin 身份驗證
  authenticatedAdmin: (req, res, next) => {
    if (helpers.getUser(req)) {
      if (helpers.getUser(req).role === 'admin') {
        return next()
      }
      return res.json({ status: 'error', message: 'permission denied' })
    } else {
      return res.json({ status: 'error', message: 'permission denied' })
    }
  },
}
