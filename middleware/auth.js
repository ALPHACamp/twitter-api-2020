const helpers = require('../_helpers')
const passport = require('../config/passport')

module.exports = {
  authToken: (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) {
        return next(err) // invoke the error handlers
      }
      if (!user) {
        return res.status(401).json({ status: 'error', message: 'Unauthorized' })
      } else {
        req.user = user
        return next()
      }
    })(req, res, next)
  },
  authUserRole: (req, res, next) => {
    //if(req.user)
    if (helpers.getUser(req)) {
      //if(req.user.role === 'admin')
      if (helpers.getUser(req).role === 'admin') {
        return res.json({ status: 'error', message: 'Admin is not authorized.' })
      }
      return next()
    }
    return res.status(401).json({ status: 'error', message: 'Unauthorized' })
  },
  authAdminRole: (req, res, next) => {
    //if(req.user)
    if (helpers.getUser(req)) {
      //if(req.user.role === 'user')
      if (helpers.getUser(req).role === 'user') {
        return res.json({ status: 'error', message: 'User is not authorized.' })
      }
      return next()
    }
    return res.status(401).json({ status: 'error', message: 'Unauthorized' })
  }
}