// 載入被設定過的passport物件
const passport = require('../config/passport')
const helpers = require('../_helpers')

// 驗證目前登入者是否合法，並允許一般前台登入者能進入路由
const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    const error = new Error()

    if (err || !user) {
      error.code = 401
      error.message = '使用者未從登入驗證獲取憑證不予使用'
      return next(error)
    }

    req.user = user
    return next()
  })(req, res, next)
}

/**
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 */

/* 未來開發功能 - 能夠避免管理員使用前台功能的API */
// 驗證目前登入者是否為管理員，並只一般前台登入者能進入路由
// 舉例來說，假如不允許後台管理員使用前台使用者相關的API，那麼就是可以這樣放置
// authenticated 為驗證登入，登入成功才能進一步驗證是否為前台使用者，若不是就報錯並不允許使用
// 若是前台使用者的話，就導向userRouter指定的路由/API
// router.use('/users', authenticated, authenticatedUser, userRouter)
function authenticatedUser(req, res, next) {
  const user = helpers.getUser(req)

  if (user && user.role === 'user') return next()
  const error = new Error()
  error.code = 403
  error.message = '存取被拒'
  return next(error)
}


// 驗證目前登入者是否為管理員，並只允許管理員進入路由
/**
 * 
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 * @returns 
 */
function authenticatedAdmin(req, res, next) {
  const user = helpers.getUser(req)
  
  if (user && user.role === 'admin') return next()

  const error = new Error()
  error.code = 403
  error.message = '存取被拒'
  return next(error)

}

exports = module.exports = {
  authenticated,
  authenticatedUser,
  authenticatedAdmin
}
