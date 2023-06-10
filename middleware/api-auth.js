const passport = require('../config/passport')
const { getUser } = require('../_helpers')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ status: 'error', message: 'unauthorized!' })
    res.locals.userId = user.dataValues.id
    req.user = user.dataValues
    next()
  })(req, res, next)
}

const authenticatedAdmin = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(403).json({ status: 'error', message: 'Forbidden' })
    res.locals.userId = user.dataValues.id
    req.user = user.dataValues
    next()
  })(req, res, next)
}

const roleChecker = (req, res, next) => {
  const user = getUser(req)
  if (user.role === 'admin' || (user.name === 'root' && user.id === 1)) return next()
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}

module.exports = {
  authenticated, roleChecker, authenticatedAdmin
}
