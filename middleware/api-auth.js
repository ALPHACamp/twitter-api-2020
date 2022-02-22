const passport = require('../config/passport')
const helpers = require('../_helpers')


// 前台的登入驗證
// const authenticated = passport.authenticate('jwt', { session: false })

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ status: 'error', message: '請先登入' })
    req.user = user
    next()
  })(req, res, next)
}

//避免管理者登入前台
const authenticatedUser = (req, res, next) => {
  if (helpers.getUser(req)) {
    if (helpers.getUser(req).role === 'user') { return next() }
    return res.status(403).json({ message: '不可以用管理者帳戶登入前台' })
  } else {
    return res.status(401).json({ message: '請先登入' })
  }
}

//避免普通用戶登入後台
const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req)) {
    if (helpers.getUser(req).role === 'admin') { return next() }
    return res.status(403).json({ message: '普通用戶不可以登入後台' })
  } else {
    return res.status(401).json({ message: '請先登入' })
  }
}

module.exports = {
  authenticated, authenticatedUser, authenticatedAdmin
}
