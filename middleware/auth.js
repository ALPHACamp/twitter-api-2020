const passport = require('../config/passport')
const helper = require('../_helpers')
module.exports = {
  authenticated: (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
      if (!user) {
        return res
          .status(401)
          .json({ status: 'error', message: "token doesn't exist" })
      }
      req.user = user
      return next()
    })(req, res, next)
  },
  authenticatedUser: (req, res, next) => {
    if (helper.getUser(req)) {
      if (helper.getUser(req).role === null) {
        return next()
      }
      return res.json({ status: 'error', message: 'permission denied' })
    } else {
      return res.json({ status: 'error', message: 'permission denied' })
    }
  },

  authenticatedAdmin: (req, res, next) => {
    if (helper.getUser(req)) {
      if (helper.getUser(req).role === 'admin') {
        return next()
      }
      return res.json({ status: 'error', message: 'permission denied' })
    } else {
      return res.json({ status: 'error', message: 'permission denied' })
    }
  }
}
