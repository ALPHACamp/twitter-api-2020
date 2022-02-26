const helpers = require('../_helpers')
const passport = require('../config/passport') // 引入 passport

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => { 
    if (err || !user) return res.status(401).json({ status: 'error', message: 'Unauthorized!' })
    req.user = user
    next()
  })(req, res, next)
}

const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
  if (helpers.getUser(req) && helpers.getUser(req).role === 'admin') return next()
} else {
  return res.status(403).json({ status: 'error', message: 'Permission denied!' })
} return res.status(403).json({ status: 'error', message: 'Permission denied!' })
}

module.exports = {
  authenticated,
  authenticatedAdmin
}