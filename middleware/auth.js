const passport = require('passport')

function authenticated (req, res, next) {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ status: 'error', message: 'unauthorized' })

    req.user = user
    next()
  })(req, res, next) // invoke function
}

module.exports = {
  authenticated
}
