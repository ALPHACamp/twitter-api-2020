
const passport = require('../config/passport')
const helpers = require('../_helpers')

const authenticator = (req, res, next) => {
  return passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ success: false, message: 'unauthorized' }) // 如果有錯、或認證失敗則回傳401:無法辨識的使用者

    if (helpers.getUser(req).role !== 'user') return res.status(403).json({ success: false, message: 'permission denied' }) // 如果角色錯誤則回傳403:使用者權限不足

    req.user = user // 必須自己設定req.user
    return next()
  })(req, res, next)
}

const authenticatorAdmin = (req, res, next) => {
  return passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ success: false, message: 'unauthorized' }) // 如果有錯、或認證失敗則回傳401:無法辨識的使用者

    if (helpers.getUser(req).role !== 'admin') return res.status(403).json({ success: false, message: 'permission denied' }) // 如果角色錯誤則回傳403:使用者權限不足

    req.user = user // 必須自己設定req.user
    return next()
  })(req, res, next)
}

module.exports = { authenticator, authenticatorAdmin }
