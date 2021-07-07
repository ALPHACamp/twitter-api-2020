function getUser(req) {
  return req.user;
}

const passport = require('./config/passport')

const authenticated = passport.authenticate('jwt', { session: false })

function authenticatedUser(req, res, next) {
  if (req.user) {
    if (req.user.role === 'user') { return next() }
    res.redirect('/api/users/signin')
    return res.json({ status: 'error', message: 'permission denied' })
  }
  res.redirect('/api/users/signin')
  return res.json({ status: 'error', message: 'permission denied' })
}

function authenticatedAdmin(req, res, next) {
  if (req.user) {
    if (req.user.role === 'admin') { return next() }
    res.redirect('/api/users/signin')
    return res.json({ status: 'error', message: 'permission denied' })
  }
  res.redirect('/api/users/signin')
  return res.json({ status: 'error', message: 'permission denied' })
}

module.exports = {
  getUser,
  authenticatedUser,
  authenticatedAdmin,
  authenticated
};