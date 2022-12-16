const passport = require('../config/passport')
const { getUser, ensureAuthenticated } = require('../_helpers')

// const helpers = require('../_helpers')
// 驗證登入狀態
const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ success: 'false', message: 'unauthorized' })
    }
    if (user) {
      req.user = user
    }
    next()
  })(req, res, next)
}
// const authenticated = (req, res, next) => {
//   // if (req.isAuthenticated)
//   if (helpers.ensureAuthenticated(req)) {
//     return next()
//   }
//   return res.status(401).json({ success: 'false', message: 'unauthorized' })
// }

// admin 權限驗證
const authenticatedAdmin = (req, res, next) => {
  if (getUser(req)?.role === 'admin') return next()
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}

// const authenticatedAdmin = (req, res, next) => {
//   // if (req.isAuthenticated)
//   if (helpers.ensureAuthenticated(req)) {
//     if (helpers.getUser(req).isAdmin) return next()
//   }
//   return res.status(403).json({ status: 'error', message: 'permission denied' })
// }

// user 權限驗證
const authenticatedUser = (req, res, next) => {
  if (getUser(req)?.role === 'user' || getUser(req)?.name === 'root') {
    return next()
  }

  return res.status(403).json({ status: 'error', message: 'permission denied' })
}
// const authenticatedUser = (req, res, next) => {
//   console.log('req user:', req.user)
//   if (helpers.getUser(req)?.role === 'user') return next()
//   // console.log('helpers:', helpers)
//   // console.log('helpers.ensureAuthenticated:', helpers.ensureAuthenticated(req))
//   // console.log('helpers.getUser:', helpers.getUser(req))
//   // if (helpers.ensureAuthenticated(req)) {
//   //   if (helpers.getUser(req).id === Number(req.params.id)) return next()
//   // }
//   return res.status(403).json({ status: 'error', message: 'permission denied' })
// }

module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticatedUser
}
