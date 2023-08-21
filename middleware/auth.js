const passport = require('../config/passport')
const helpers = require('../_helpers')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', {session: false}, (err, user) => {
    req.user = user
    if (err || !user) return res.status(401).json({ status: 'error', message: 'unauthorized' })
    next()
  })(req, res, next)
}

const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req) && helpers.getUser(req).role === 'admin') {
    next()
  }else{
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