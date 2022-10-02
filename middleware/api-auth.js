const passport = require('../config/passport') // 引入 passport

// const authenticated = passport.authenticate('jwt', { session: false })

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ status: 'error', message: 'unauthorized' })
    // passport 在 authenticated 加入callback ，要自行處理驗證成功，把user存進req ，這件事是驗證成功後調用req.login() 函式處理的
    req.logIn(user, function (err) {
      if (err) { return next(err) }
      return req.user
    })
    next()
  })(req, res, next)
}

const authenticatedAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next()
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}
module.exports = {
  authenticated,
  authenticatedAdmin
}
