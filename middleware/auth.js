const passport = require('../config/passport')
const helpers = require('../_helpers')

const authenticated = (req, res, next) => { // 用jwt策略驗證
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ status: 'error', message: '沒登入' })
    req.user = user // 用cb之後變成req.logIn函式處理所以要自己處理驗證成功時放入req.user
    next()
  })(req, res, next)
}

const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req) && helpers.getUser(req).role === 'admin') {
    next()
  } else {
    return res.status(403).json({ status: 'error', message: '帳號不存在！' })
  }
}
const authenticatedUser = (req, res, next) => {
  if (helpers.getUser(req) && helpers.getUser(req).role === 'user') {
    next()
  } else {
    return res.status(403).json({ status: 'error', message: '帳號不存在！' })
  }
}

module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticatedUser
}
