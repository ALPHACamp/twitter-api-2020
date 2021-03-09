const passport = require('../config/passport')
const helpers = require('../_helpers')

module.exports = {
  checkIfLoggedIn: (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) return res.status(500).json({ status: 'error', message: '伺服器出錯，請聯繫客服人員，造成您的不便，敬請見諒。' })
      if (!user) return res.status(401).json({ status: 'error', message: '登入後才能使用。' })
      req.user = user
      next()
    })(req, res, next)
  },

  checkIfAdmin: (req, res, next) => {
    if (helpers.getUser(req)) {
      if (helpers.getUser(req).role === 'admin') return next()
      // 403 forbidden (after authorized)
      return res.status(403).json({ status: 'error', message: '此用戶沒有後台權限。' })
    }
    // 401 unauthorized fail login
    return res.status(401).json({ status: 'error', message: '登入後才能使用。' })
  },

  checkIfUser: (req, res, next) => {
    if (helpers.getUser(req)) {
      if (helpers.getUser(req).role === 'user' || !helpers.getUser(req).role) return next()
      return res.status(403).json({ status: 'error', message: '此用戶沒有前台權限。' })
    }
    return res.status(401).json({ status: 'error', message: '登入後才能使用。' })
  }

}
