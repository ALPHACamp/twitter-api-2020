function getUser(req) {
  return req.user;
}

const passport = require('./config/passport')
const jwt = require('jsonwebtoken')
const authenticated = passport.authenticate('jwt', { session: false })

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