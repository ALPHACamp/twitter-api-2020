const passport = require('../config/passport')
const helpers = require('../_helpers')
// use helpers.getUser(req) to replace req.user
function authenticated (req, res, next) {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) {
      err.message = 'Internal Server Authentication Error!'
      return next(err)
    }
    if (!user) {
      return res.status(401).json({ success: false, error: 'unauthorized' })
    }
    req.user = user
    return next()
  })(req, res, next)
}
function authenticatedSuccess (req, res, next) {
  res.status(200).json({ success: true, error: null })
}

function authenticatedAdmin (req, res, next) {
  if (helpers.getUser(req).role === 'admin') return next()
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}

module.exports = { authenticated, authenticatedSuccess, authenticatedAdmin }
