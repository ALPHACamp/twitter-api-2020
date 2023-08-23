const passport = require('../config/passport')
const helpers = require('../_helpers')
// use helpers.getUser(req) to replace req.user

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    // 在這個 middleware 已經把 passport 裡設定回傳的 cb(err, user) 傳進來用掉了
    if (err || !user) return res.status(401).json({ status: 'error', message: 'unauthorized' })
    req.user = user // 所以要在這行將 req.user 傳下去，到下個 middleware 時 helpers.getUser(req) 才接的到
    next()
  })(req, res, next)
}

const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req) && (helpers.getUser(req).role === 'admin')) return next()
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}
module.exports = {
  authenticated,
  authenticatedAdmin
}
