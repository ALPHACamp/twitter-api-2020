const helpers = require('../_helpers')
const passport = require('../config/passport')

const authenticated = passport.authenticate('jwt', {
  session: false
})

const isUser = (req, res, next) => {
  if (helpers.getUser(req)?.role === 'user') return next()
  return res.json({
    status: 'error',
    message: 'permission denied'
  })
}

const isAdmin = (req, res, next) => {
  if (helpers.getUser(req)?.role === 'admin') return next()
  return res.json({
    status: 'error',
    message: 'permission denied'
  })
}

module.exports = {
  authenticated,
  isUser,
  isAdmin
}
