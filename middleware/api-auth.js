const passport = require('../config/passport')
const { User } = require('../models')
const { getUser } = require('../_helpers')

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

// admin 權限驗證
const authenticatedAdmin = (req, res, next) => {
  if (getUser(req)?.role === 'admin') return next()
  return res.status(403).json({ status: 'error', message: '權限不足' })
}

// 驗證是否為 user
const authenticatedUser = (req, res, next) => {
  const { account } = req.body
  const id = req.params.id
  if (account !== null) {
    User.findAll({ where: { account } }).then(user => {
      user.forEach(item => {
        if (!item || item.role === 'admin') {
          return res
            .status(403)
            .json({ success: 'false', message: '帳號不存在 !' })
        }
      })
      return next()
    })
  }
  if (id) {
    User.findAll({ where: { id } }).then(user => {
      if (!user || user.role === 'admin') {
        return res
          .status(403)
          .json({ success: 'false', message: '帳號不存在 !' })
      }
      return next()
    })
  }
}

module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticatedUser
}
