const helpers = require('../helpers/auth-helpers')
const passport = require('../config/passport') // 引入 passport

// const authenticated = passport.authenticate('jwt', { session: false })

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) return res.json({ status: 'error', message: 'err' })
    if (!user) return res.json({ status: 'error', message: 'no user' })
    req.user = user
    next()
  })(req, res, next)
}

const authenticatedAdmin = (req, res, next) => {
  console.log(req.user)
  if (req.user && req.user.role === 'admin') return next()
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}

const authenticatedNoAdmin = (req, res, next) => {
    if (req.user && req.user.role !== 'admin') return next()
    return res.status(403).json({ status: 'error', message: 'this account is admin' })
}

module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticatedNoAdmin
}
