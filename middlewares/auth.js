const passport = require('../config/passport')
const helpers = require('../_helpers')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) return next(err)
    if (!user) return next(new Error('no user'))
    req.user = { ...user.dataValues }
    return next()
  })(req, res, next)
}

const checkRole = (role = 'user') => {
  return (req, res, next) => {
    if (helpers.getUser(req).role !== role) {
      return next(new Error('Permission denied.'))
    }
    return next()
  }
}

module.exports = {
  authenticated,
  checkRole
}
