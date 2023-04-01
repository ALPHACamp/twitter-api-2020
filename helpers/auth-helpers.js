const getUser = req => req.user || null
const ensureAuthenticated = req => req.isAuthenticated()

module.exports = {
  getUser,
  ensureAuthenticated
}
