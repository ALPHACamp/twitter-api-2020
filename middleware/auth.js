const passport = require('../config/passport')

// before login
const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(200).json({ status: 'error', message: '請先登入才能使用' })
    req.user = user.dataValues
    next()
  })(req, res, next)
}

const authenticatedUser = (req, res, next) => {
  req.user.role === 'user' ? next() : res.status(200).json({ status: 'error', message: '管理者沒有權限登入前台。' })
}

const authenticatedAdmin = (req, res, next) => {
  req.user.role === 'admin' ? next() : res.status(200).json({ status: 'error', message: '一般使用者沒有權限登入後台。' })
}

module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticatedUser
}
