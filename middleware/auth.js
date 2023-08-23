const passport = require('../config/passport')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ status: 'error', message: '未經授權' })
    req.user = user
    next()
  })(req, res, next)
}

module.exports = {
  authenticated
}
