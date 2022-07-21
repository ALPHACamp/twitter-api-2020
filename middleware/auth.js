const passport = require('../config/passport')
const { StatusCodes } = require('http-status-codes')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (error, user) => {
    if (error) return next(error)
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: 'error',
        message: '無使用者權限'
      })
    }
    req.user = { ...user.dataValues }
    next()
  })(req, res, next)
}

module.exports = {
  authenticated
}
