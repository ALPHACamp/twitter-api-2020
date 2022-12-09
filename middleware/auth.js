const passport = require('../config/passport')
const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (!user) return res.status(401).json({ status: 'error', message: 'unauthorized' })
    req.logIn(user, (error = err) => {
      if (error) return next(error)
    })
    next()
  })(req, res, next)
}

module.exports = {
  authenticated
}
