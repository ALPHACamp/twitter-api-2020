// 載入被設定過的passport物件
const passport = require('../config/passport')
const helpers = require('../_helpers')

// 驗證目前登入者是否合法
const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {

    if (err || !user) {
      const error = new Error()
      error.code = 401
      error.message = '使用者未從登入驗證獲取憑證不予使用'
      return next(error)
    }
    req.user = user
    next()
  })(req, res, next)
}
// 驗證目前登入者是否為管理員
/**
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 * @returns 
 */
function authenticatedAdmin(req, res, next) {
  const user = helpers.getUser()

  if (user && user.role === 'admin') return next()

  return res.status(403).json({
    status: 403,
    message: 'permission denied'
  })

}

exports = module.exports = {
  authenticated,
  authenticatedAdmin
}
