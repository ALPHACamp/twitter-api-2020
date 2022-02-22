// 載入被設定過的passport物件
const passport = require('../config/passport')
const helpers = require('../_helpers')

// 驗證目前登入者是否合法
const authenticated = passport.authenticate('jwt', { session: false })

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
