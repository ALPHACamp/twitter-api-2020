const passport = require('../config/passport')
const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ status: 'error', message: '驗證失敗！' })

    req.logIn(user, err => {
      if (err) { return next(err) }
      return res.send(user)
    })
    next()
  })(req, res, next)
}

module.exports = {
  authenticated
}
