const passport = require('../config/passport')
const helpers = require('../_helpers')

const authenticated = passport.authenticate('jwt', { session: false })

function authenticatedAdmin (req, res, next) {
  req.user = helpers.getUser(req)
  if (req.user) {
    if (req.user.role === 'admin') { return next() }
    return res.status(403).json({ status: 'error', message: 'Permission denied' })
  } else {
    return res.status(401).json({ status: 'error', message: 'Permission denied' })
  }
}

module.exports = {
  authenticated,
  authenticatedAdmin
}
