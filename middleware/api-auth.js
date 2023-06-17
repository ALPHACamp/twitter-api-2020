const passport = require('../config/passport')
const helpers = require('../_helpers')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ status: 'error', message: '登入信息驗證失敗' })
    req.user = user
    return next()
  })(req, res, next)
}

const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req) && helpers.getUser(req).role === 'user') throw new Error('帳號不存在!')
  if (helpers.getUser(req) && helpers.getUser(req).role === 'admin') return next()
  return res.status(403).json({ status: 'error', message: 'Not a real ADMIN' })
}

const isUser = (req, res, next) => {
  if (helpers.getUser(req) && helpers.getUser(req).role === 'admin') throw new Error('帳號不存在!')
  if (helpers.getUser(req) && helpers.getUser(req).role === 'user') return next()
  return res.status(403).json({ status: 'error', message: 'Not a real USER' })
}

module.exports = {
  authenticated,
  authenticatedAdmin,
  isUser
}
