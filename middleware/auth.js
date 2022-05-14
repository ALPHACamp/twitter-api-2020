const passport = require('../config/passport')

const { getUser } = require('../_helpers')

const authenticated = passport.authenticate('jwt', { session: false })

const authenticatedUser = (req, res, next) => {
  req.user = getUser(req)

  if (req.user && req.user.role === '') return next()
  return res.status(403).json({
    status: 'error',
    message: 'Permission denied'
  })
}

// Angela: authenticated Admin

module.exports = {
  authenticated,
  authenticatedUser
}
