const passport = require('../config/passport')
const helpers = require('../_helpers')
const jwt = require('jsonwebtoken')

// 驗證 authenticated
const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ status: 'error', message: 'unauthorized' })
    req.user = user
    next()
  })(req, res, next)
}

// 確認user是否存在
const ensureAccountExists = (req, res, next) => {
  if (!user || !user.id) {
    return res.status(400).json({ error: 'User not found' })
  }
  next()
}

// 區分登入者的role
const isUser = (req, res, next) => {
  if (helpers.getUser(req).role !== 'user') return res.status(403).json({ status: 'error', message: 'Not a valid account' })
  next()
}

const isAdmin = (req, res, next) => {
  if (helpers.getUser(req).role !== 'admin') return res.status(403).json({ status: 'error', message: 'Not a valid account' })
  next()
}

// 驗證後的user
const authenticatedUser = (req, res, next) => {
  if (helpers.getUser(req).role === 'user') return next()
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}

// 驗證後的admin
const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req).role === 'admin') return next()
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}

const signInAuth = (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (info) {
      return res.status(401).json(info)
    }
    req.user = user
    next()
  })(req, res, next)
}

module.exports = {
  authenticated,
  ensureAccountExists,
  isUser,
  isAdmin,
  authenticatedUser,
  authenticatedAdmin,
  signInAuth
}
