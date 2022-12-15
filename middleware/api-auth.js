const passport = require('../config/passport')
const { User } = require('../models')

// 驗證user登入狀態
const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ success: 'false', message: 'unauthorized' })
    }
    next()
  })(req, res, next)
}

// 驗證 admin 帳號密碼
const adminPassValid = (req, res, next) => {
  const { account, password } = req.body
  if (account === 'root' && password === '12345678') {
    return next()
  }
  return res.status(401).json({ success: 'false', message: 'unauthorized' })
}

// 驗證是否為 admin
const authenticatedAdmin = (req, res, next) => {
  const { account } = req.body

  User.findOne({ where: { account } }).then((user) => {
    if (!user || user.role === 'user') {
      return res
        .status(403)
        .json({ success: 'false', message: 'permission denied' })
    }
    return next()
  })
}

// 驗證是否為 user
const authenticatedUser = (req, res, next) => {
  const { account } = req.body
  const id = req.params.id

  if (account !== null) {
    User.findAll({ where: { account } }).then((user) => {
      user.forEach((item) => {
        if (!item || item.role === 'admin') {
          return res
            .status(403)
            .json({ success: 'false', message: 'permission denied' })
        }
      })
      return next()
    })
  }
  if (id) {
    User.findAll({ where: { id } }).then((user) => {
      if (!user || user.role === 'admin') {
        return res
          .status(403)
          .json({ success: 'false', message: 'permission denied' })
      }
      return next()
    })
  }
}

module.exports = {
  authenticated,
  authenticatedAdmin,
  adminPassValid,
  authenticatedUser
}
