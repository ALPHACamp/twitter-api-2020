const passport = require('./config/passport')

function ensureAuthenticated (req) {
  return req.isAuthenticated()
}
function getUser(req) {
  return req.user;
}

function switchAuthenticatedMiddleware() {
  if (process.env.NODE_ENV === 'test') {
    return (req, res, next) => {
      next()
    }
  } else {
    return passport.authenticate('jwt', { session: false })
  }
}

module.exports = {
  ensureAuthenticated,
  getUser,
  switchAuthenticatedMiddleware
};