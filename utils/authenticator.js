const passport = require('../config/passport')
const helpers = require('../_helpers')

module.exports = {
  checkIfLoggedIn: passport.authenticate('jwt', { session: false }),

  checkIfAdmin: (req, res, next) => {
    if (helpers.getUser(req)) {
      if (helpers.getUser(req).role === 'admin') return next()
      //403 forbidden (after authorized)
      return res.status(403).json({ status: 'error', message: '此用戶沒有管理員權限。' })
    } 
    //401 unauthorized fail login
    return res.status(401).json({ status: 'error', message: '登入後才能使用。' })
  },

  checkIfUser: (req, res, next) => {
    if (helpers.getUser(req)) {
      if (helpers.getUser(req).role === 'user') return next()
      return res.status(403).json({ status: 'error', message: '此用戶沒有前台權限。' })
    } 
    return res.status(401).json({ status: 'error', message: '登入後才能使用。' })
  }

}
