const passport = require('../config/passport')
const helpers = require('../_helpers')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user)
      return res
        .status('401')
        .json({ status: 'error', message: 'Unauthorized, please login!' })

    req.user = user.dataValues

    return next()
  })(req, res, next)
}

const checkRoleInverse = (role) => {
  return (req, res, next) => {
    
    if (helpers.getUser(req).role !== role) return next()

    return res
      .status('403')
      .json({ status: 'error', message: 'Permission denied.' })
  }
}

module.exports = {
  authenticated,
  checkRoleInverse
}
