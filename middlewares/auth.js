const helpers = require('../_helpers')
const passport = require('../config/passport')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (user) {
      // 因應測試檔，我們手動將驗證後找到的user塞到req中
      req.user = user.dataValues
      return next()
    }
    return res.status(401).json({ message: '請先登入在使用' })
  })(req, res, next)
}

const authenticatedUser = (req, res, next) => {
  if (req.user) {
    if (req.user.role === 'user') { return next() }
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}

const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req)) {
    if (helpers.getUser(req).role === 'admin') { return next() }
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}

module.exports = {
  authenticated, authenticatedUser, authenticatedAdmin
}