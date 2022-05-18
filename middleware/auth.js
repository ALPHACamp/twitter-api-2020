
const passport = require('../config/passport')
const helpers = require('../_helpers')

// before login
const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(200).json({ status: 'error', message: '請先登入才能使用' })
    req.user = user
    next()
  })(req, res, next)
}

const authenticatedUser = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (helpers.getUser(req).role !== 'admin') return next()

    // avoid admin to login
    return res.status(200).json({ status: 'error', message: '管理者帳號無法登入前台。' })
  })(req, res, next)
}

const authenticatedAdmin = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (helpers.getUser(req).role !== 'user') return next()

    // avoid user to login
    return res.status(200).json({ status: 'error', message: '一般使用者沒有權限登入後台。' })
  })(req, res, next)
}

module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticatedUser
}