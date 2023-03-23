const passport = require('../config/passport')
// (下1) 真麻煩，不知這到底有何用
// const { getUser } = require('../_helpers') // 用 getUser(...) 取代 req.user
// const authenticated = passport.authenticate('jwt', { session: false }) // 過去寫法
// (下) 為了增加 json 而改的寫法
// const auth = (req, res, next) => { //! 準備改
const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false },
    // 下1 的 err, user, 不知是從哪來 (雖然他們都是參數就是...
    (err, user) => {
      if (err || !user) return res.status(401).json({ status: 'error', message: 'Unauthorized' })
      req.user = user // 為了下面 authenticatedAdmin，須把 req.user 資料手動填入，不懂 user 來源，猜對而已
      next()
    })(req, res, next) // 這裡是 IIFE，因為 Fn. 內有 Fn. (authenticated 內有 (err, user)...)，需再被 invoke
}

// const isAdmin = (req, res, next) => { //! 準備改
const authenticatedAdmin = (req, res, next) => {
  if (req.user?.isAdmin) return next()
  return res.status(403).json({ status: 'error', message: 'permission denied. You are user' })
}

// const isUser = (req, res, next) => { //! 準備改
const authenticatedUser = (req, res, next) => {
  if (!req.user?.isAdmin) return next()
  return res.status(403).json({ status: 'error', message: 'permission denied. Your are admin.' })
}
module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticatedUser
}
// module.exports = { //!準備改
//   auth,
//   isAdmin,
//   isUser
// }
