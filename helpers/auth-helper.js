const helpers = {
  getUser: (req) => {
    return req.user || null
  },
  ensureAuthenticated: (req) => {
    return req.isAuthenticated()
  }
}

module.exports = helpers