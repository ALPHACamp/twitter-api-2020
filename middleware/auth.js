const helpers = require('../_helpers')
const passport = require('../config/passport')

module.exports = {
  authenticated: passport.authenticate('jwt', { session: false }),
  authenticatedAdmin: (req, res, next) => {
    if (helpers.getUser(req)) {
      if (helpers.getUser(req).isAdmin) {
        return next()
      }
      return res.json({ status: 'error', message: 'permission denied' })
    } else {
      return res.json({ status: 'error', message: 'permission denied' })
    }
  }
}
