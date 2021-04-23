const passport = require('../config/passport')
const helpers = require('../_helpers')

function authenticated (req, res, next) {
  passport.authenticate('jwt', { session: false }, (error, user, info) => {
    if (error) {
      const data = { status: 'error', message: error.toString() }
      console.log(error)
      return res.status(500).json(data)
    }
    if (!user) {
      const data = { status: 'error', message: 'Unauthorized' }
      return res.status(401).json(data)
    }
    req.user = user
    return next()
  })(req, res, next)
}

function authenticatedAdmin (req, res, next) {
  req.user = helpers.getUser(req)
  if (req.user) {
    if (req.user.role === 'admin') { return next() }
    return res.status(403).json({ status: 'error', message: 'Administrator only. User permission denied.' })
  } else {
    return res.status(401).json({ status: 'error', message: 'Permission denied.' })
  }
}

function authenticatedUser (req, res, next) {
  req.user = helpers.getUser(req)
  if (req.user) {
    if (req.user.role === 'user') { return next() }
    return res.status(403).json({ status: 'error', message: 'User only. Administrator permission denied.' })
  } else {
    return res.status(401).json({ status: 'error', message: 'Permission denied.' })
  }
}

module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticatedUser
}
