
function getUser (req) {
  return req.user
}

module.exports = {
  getUser
}

// use helpers.getUser(req) to replace req.user
// function authenticated (req, res, next) {
//   // passport.authenticate('jwt', { ses...
// }
