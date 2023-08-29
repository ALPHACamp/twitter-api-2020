const passport = require('../config/passport') // 引入 passport
const helpers = require('../_helpers')

// authenticated 驗證使用者的登入狀況，如果登入了才給予通過，錯誤處理移動到controller
const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (!user) { return res.status(401).json({ status: 'error', message: 'Unauthorized' }) }
    if (err) return next(err)
    next()
  })(req, res, next)
}

// authenticatedAdmin 確認使用者是否為admin，如果是才給予通過
const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req) && helpers.getUser(req).role === 'admin') return next()
  return res.status(403).json({ status: 'error', message: '沒有admin權限' })
}

// authenticatedAdmin 確認當前使用者是否為登入者
const authenticatedCurrentUser = (req, res, next) => {
  if (helpers.getUser(req).id === Number(req.params.id)) return next()
  return res.status(403).json({
    status: 'error',
    message: '只能編輯自己的資料!'
  })
}

module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticatedCurrentUser
}
