const passport = require('../config/passport')
const helpers = require('../_helpers')
const authenticated = (req, res, next) => passport.authenticate('jwt', { session: false }, (err, user) => {
  if (!user) {
    return res.status(403).json({ status: 'error', message: 'permission denied' })
  }
  if (err) {
    console.log(err)
    return res.status(403).json({ status: 'error', message: 'permission denied' })
  }
  const userData = { ...user.dataValues }
  req.user = userData
  return next()
})(req, res, next)

const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req) && helpers.getUser(req).role === 'admin') return next()
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}

module.exports = {
  authenticated,
  authenticatedAdmin
}
