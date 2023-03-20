// 不知這檔案有沒有用，之後要檢查
const getUser = req => req.user || null
const ensureAuthenticated = req => req.isAuthenticated()

module.exports = {
  getUser,
  ensureAuthenticated
}
