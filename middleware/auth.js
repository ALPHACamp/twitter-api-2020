const passport = require('passport')
const helper = require('../_helpers')
module.exports = {
  authenticated:  (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
      if (err) {
        console.log(err)
        return res
          .status(403)
          .json({ status: 'error', message: ' permission is denied' })
      }
      console.log(user)
      req.user = user
      return next()
    })(req, res, next)
  },
  authenticatedAdmin: (req, res, next) => {
    req.user = helper.getUser(req)
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'permission is denied, only Administrator can visit'
      })
    }
    return next()
  }
}
