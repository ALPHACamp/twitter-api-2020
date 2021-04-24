const passport = require('../config/passport')
const helpers = require('../_helpers')

// const authenticated = passport.authenticate('jwt', { session: false })
const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (!user) {
      console.log(err)
      return res.status(401).json({
        status: 'error',
        message: 'JWT token verification failed!'
      })
    }
    req.user = user
    return next()
  })
}

const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req)) {
    if (helpers.getUser(req).role === 'admin') {
      return next()
    }
    return res.json({ status: 'error', message: 'you don\'t have authority to login!' })
  } else {
    return res.json({ status: 'error', message: 'you don\'t have authority to login!' })
  }
}

module.exports = {
  authenticated,
  authenticatedAdmin
}
