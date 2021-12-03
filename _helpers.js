function ensureAuthenticated (req) {
  return req.isAuthenticated()
}

function getUser (req) {
  return req.user
}

module.exports = {
  ensureAuthenticated,
  getUser
}
