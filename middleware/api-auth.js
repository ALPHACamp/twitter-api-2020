const passport = require('../config/passport')
// const { getUser } = require('../_helpers')
// 幹！連名字都得一樣才行 (上1 不行 下1 行)
const helpers = require('../_helpers') // AC 為了測試要我們改的，用 getUser(...) 取代 req.user
// const authenticated = passport.authenticate('jwt', { session: false }) // 過去寫法
// (下) 為了增加 json 而改的寫法
const auth = (req, res, next) => {
  passport.authenticate('jwt', { session: false },
    // 下1 的 err, user, 不知是從哪來 (雖然他們都是參數就是...
    (err, user) => {
      if (err || !user) return res.status(401).json({ status: 'error', message: 'Unauthorized' })
      req.user = user // 為了下面 authenticatedAdmin，須把 req.user 資料手動填入，不懂 user 來源，猜對而已
      next()
    })(req, res, next) // 這裡是 IIFE，因為 Fn. 內有 Fn. (authenticated 內有 (err, user)...)，需再被 invoke
}

const isAdmin = (req, res, next) => {
  // if (req.user?.isAdmin) return next() //! 為測試檔改成 下1，都沒問題再刪
  if (helpers.getUser(req).role === 'admin') return next()
  return res.status(403).json({ status: 'error', message: 'permission denied. You are user' })
}

const isUser = (req, res, next) => {
  // if (!req.user?.isAdmin) return next() //! 為測試檔改成 下1，都沒問題再刪
  if (helpers.getUser(req).role === 'user') return next()
  // if (req.user?.role === 'user') return next()
  return res.status(403).json({ status: 'error', message: 'permission denied. Your are admin.' })
}
module.exports = {
  auth,
  isAdmin,
  isUser
}
