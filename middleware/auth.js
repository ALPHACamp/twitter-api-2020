const helpers = require('../helpers/auth-helpers')

// 登入驗證
const authenticated = (req, res, next) => {
  // if (req.isAuthenticated)
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/signin')
}

// admin 身份驗證
const authenticatedAdmin = (req, res, next) => {
  // if (req.isAuthenticated)
  if (helpers.ensureAuthenticated(req)) { // 是否登入
    if (helpers.getUser(req).isAdmin) return next() // 是否為 admin，是就往下走
    res.redirect('/') // 否就導回首頁
  } else {
    res.redirect('/signin') // 沒有登入就回 signin page
  }
}
module.exports = {
  authenticated,
  authenticatedAdmin
}
