const passport = require('../config/passport')
const helpers = require('../_helpers')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        status: 'error',
        message: '帳號不存在'
      })
    }
    req.user = user
    next()
  })(req, res, next)
}

const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req) && helpers.getUser(req).role === 'user') {
    return res.status(401).json({
      status: 'error',
      message: '帳號不存在'
    })
  }
  next()
}

const authenticatedUser = (req, res, next) => {
  if (helpers.getUser(req) && helpers.getUser(req).role === 'admin') {
    return res.status(401).json({
      status: 'error',
      message: '帳號不存在'
    })
  }
  next()
}

module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticatedUser
}
