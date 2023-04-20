function getUser (req) {
  return req.user || null
}

function ensureAuthenticated (req) {
  return req.isAuthenticated()
}

module.exports = {
  getUser,
  ensureAuthenticated
}
