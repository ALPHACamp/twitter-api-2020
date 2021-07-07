function getUser(req) {
  return req.user;
}


const passport = require('./config/passport')

const authenticated = passport.authenticate('jwt', { session: false })

function authenticatedUser(req, res, next) {
  if (getUser(req)) {
    if (getUser(req).role === 'user') { return next() }
    return res.json({ status: 'error', message: 'permission denied' })
  }
  return res.json({ status: 'error', message: 'permission denied' })
}

function authenticatedAdmin(req, res, next) {
  if (getUser(req)) {
    if (getUser(req).role === 'admin') { return next() }
    return res.json({ status: 'error', message: 'permission denied' })
  }
  return res.json({ status: 'error', message: 'permission denied' })
}

function authenticate(req, res, next) {
  passport.authenticate('jwt', { session: false })
};


module.exports = {
  getUser,
  authenticatedUser,
  authenticatedAdmin,
  authenticate,
  authenticated
};
