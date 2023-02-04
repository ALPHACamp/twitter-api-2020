const passport = require('../config/passport')
const helpers = require('../_helpers')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) { return res.status(401).json({ status: 401, message: 'unauthorized' }) }
    req.user = user.dataValues
    next()
  })(req, res, next)
}

const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req).role === 'admin') return next()
  return res.status(401).json({ status: 401, message: 'permission denied' })
}

const userLoginAuth = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err) }
    if (!user) { return res.status(info.status || 400).json({ status: info.status || 400, message: info.message }) }
    req.user = user
    next()
  })(req, res, next)
}

const adminLoginAuth = (req, res, next) => {
  passport.authenticate('localAdmin', (err, user, info) => {
    if (err) { return next(err) }
    if (!user) { return res.status(info.status || 400).json({ status: info.status || 400, message: info.message }) }
    req.user = user
    next()
  })(req, res, next)
}

const userAuthenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user || user.role === 'admin') return res.status(401).json({ status: 401, message: 'unauthorized' })
    req.user = user.dataValues
    next()
  })(req, res, next)
}

const admintokenAuthenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user || user.role === 'user') return res.status(401).json({ status: 401, message: 'unauthorized' })
    req.user = user.dataValues
    next()
  })(req, res, next)
}

module.exports = {
  authenticated,
  authenticatedAdmin,
  userLoginAuth,
  adminLoginAuth,
  userAuthenticated,
  admintokenAuthenticated
}