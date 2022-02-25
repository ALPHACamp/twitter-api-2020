const passport = require('../config/passport')
const helper = require('../_helpers')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ status: 'error', message: 'Unauthorized' })
    console.log(req)
    next()
  })(req, res, next)
}
const authenticatedAdmin = (req, res, next) => {
  const user = helper.getUser(req)
  // console.log(user)
  if (user?.role === 'admin') return next()
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}

module.exports = {
  authenticated,
  authenticatedAdmin
}