function getUser(req) {
  return req.user;
}

const passport = require('./config/passport')


function authenticated(req, res, next) {
  passport.authenticate('jwt', { session: false }, (error, user) => {
    if (!user) return res.json({ status: 'error', message: 'No jwt token' })
    if (error) return res.json({ status: 'error', message: error })
    req.user = user
    return next()
  })(req, res, next)
}

function authenticatedUser(req, res, next) {
  if (req.user) {
    if (req.user.role === 'user') { return next() }
    return res.json({ status: 'error', message: 'permission denied' })
  }
  return res.json({ status: 'error', message: 'permission denied' })
}

function authenticatedAdmin(req, res, next) {
  if (req.user) {
    if (req.user.role === 'admin') { return next() }
    return res.json({ status: 'error', message: 'permission denied' })
  }
  return res.json({ status: 'error', message: 'permission denied' })
}

module.exports = {
  getUser,
  authenticatedUser,
  authenticatedAdmin,
  authenticated
};