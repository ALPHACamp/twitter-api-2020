const passport = require('../config/passport')

//  everyone authenticated
const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (!user) return res.status(401).json({ stauts: 'error', message: 'unauthorized' })
    if (err) return next(err)
    next()
  })(req, res, next)
}

module.exports = {
  authenticated
}
