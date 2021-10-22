const passport = require('passport')
const helpers = require('../_helpers.js')
const { User } = require('../models')

// jwt驗證
const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, async (err, user, info) => {
    if (err) { return next(err) }
    if (!user) {
      if (info.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token已過期！' })
      } else {
        return res.status(401).json({ message: info.message })
      }
    }
    user = await User.findByPk(user.dataValues.id, {
      include: [
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
    req.user = user.dataValues
    return next()
  })(req, res, next)
}
// 驗證登入者是否為管理者=>用於後台路由
const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req)) {
    if (helpers.getUser(req).role === 'admin') { return next() }
    return res.json({ status: 'error', message: '非管理者沒有權限登入後台！' })
  } else {
    return res.json({ status: 'error', message: '未通過身份驗證！' })
  }
}
// 驗證登入者是否為非管理者=>用於前台路由
const authenticatedNotAdmin = (req, res, next) => {
  if (helpers.getUser(req)) {
    if (helpers.getUser(req).role !== 'admin') { return next() }
    return res.json({ status: 'error', message: '管理者沒有權限登入前台！' })
  } else {
    return res.json({ status: 'error', message: '未通過身份驗證！' })
  }
}

module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticatedNotAdmin
}