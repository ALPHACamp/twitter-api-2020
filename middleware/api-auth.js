const passport = require('../config/passport')
const helpers = require('../_helpers')

// const authenticated = passport.authenticate('jwt', { session: false })

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ status: 'error', message: 'unauthorized' })
    req.user = user
    next()
  })(req, res, next)
}

const authenticatedAdmin = (req, res, next) => {
  const role = helpers.getUser(req).role
  if (helpers.getUser(req) && role === 'admin') return next()
  return res.status(403).json({ status: 'error', message: '不允許訪問' })
}

module.exports = {
  authenticated,
  authenticatedAdmin
}
