const passport = require('../config/passport')
const helpers = require('../_helpers')


module.exports = {
  authenticated: (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
      if (err || !user) {
        return res.status(401).json({
          status: 'error',
          message: '尚未授權，禁止存取!'
        })
      }

      return next()
    })(req, res, next)
  },

  authenticatedAdmin: (req, res, next) => {
    const user = helpers.getUser(req)
    if (user && user.role === 'admin') next()

    return res.status(403).json({
      status: 'error',
      message: '權限不足，禁止存取!'
    })
  }
}
