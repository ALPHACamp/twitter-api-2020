const passport = require('../config/passport') // 引入 passport

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ status: 'error', message: 'unauthorized!' })
    res.locals.userId = user.dataValues.id
    next()
  })(req, res, next)
}

module.exports = {
  authenticated
}
