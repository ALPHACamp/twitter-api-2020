const helpers = require('../_helpers')
const passport = require('../config/passport')

const authenticated = passport.authenticate('jwt', {
  session: false
})

const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req)?.role === 'admin') return next()
  return res.json({
    status: 'success',
    message: 'permission denied'
  })
}

module.exports = {
  authenticated,
  authenticatedAdmin
}
