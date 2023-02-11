const passport = require('../config/passport')
const helpers = require('../_helpers')

//  everyone authenticated
const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (!user) return res.status(401).json({ stauts: 'error', message: 'Unauthorized' })
    if (err) return next(err)
    next()
  })(req, res, next)
}

//  admin authenticated
const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req)?.role === 'admin') return next()
  return res.status(403).json({
    status: 'error',
    message: 'Permission denied'
  })
}

// user authenticated
const authenticatedUser = (req, res, next) => {
  if (helpers.getUser(req)?.role === 'user') return next()
  return res.status(403).json({
    status: 'error',
    message: 'Permission denied'
  })
}

// current user authenticated
const authenticatedCurrentUser = (req, res, next) => {
  if (helpers.getUser(req).id === Number(req.params.id)) return next()
  return res.status(403).json({
    status: 'error',
    message: 'user can only edit own data'
  })
}

module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticatedUser,
  authenticatedCurrentUser
}
