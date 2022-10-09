const passport = require('../config/passport')
const helpers = require('../_helpers')

// check all routes' token
const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (error, user) => {
    if (error || !user) {
      return res.status(401).json({
        status: 'error',
        message: '尚未授權，請先登入'
      })
    }
    req.user = user // user -> js obj
    next()
  })(req, res, next)
}

// check user's auth to right route
const authAdmin = (req, res, next) => {
  if (helpers.getUser(req)?.role === 'admin') return next()
  return res.status(403).json({ status: 'error', message: 'Error: 無權限進入後台' })
}

// check user's auth to right route
const authUser = (req, res, next) => {
  if (helpers.getUser(req)?.role === 'user') return next()
  return res.status(403).json({ status: 'error', message: 'Error: 無權限進入前台' })
}

module.exports = {
  authAdmin,
  authUser,
  authenticated
}
