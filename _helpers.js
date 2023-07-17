
function getUser (req) {
  return req.user || null
}

function ensureAuthenticated (req) {
  return req.isAuthenticated()
}

module.exports = {
  getUser, ensureAuthenticated
}

// use helpers.getUser(req) to replace req.user
// function authenticated (req, res, next) {
//   // passport.authenticate('jwt', { ses...
// }
