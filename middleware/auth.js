const passport = require('../config/passport')

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
  }
}
