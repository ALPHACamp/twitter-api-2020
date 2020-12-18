const passport = require('../config/passport')
const helpers = require('../_helpers')

module.exports = {
  authenticate: (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) return next(err)
      if (!user) return res.status(401).json({ status: 'failure', message: info.message })
      req.user = user
      return next()
    })(req, res, next)
  },
  authAdmin: (req, res, next) => {
    const user = helpers.getUser(req)
    if (user) {
      if (user.role === 'admin') return next()
      return res.json({ status: 'failure', message: 'permission denied' })
    }
    return res.json({ status: 'failure', message: 'permission denied' })
  },
  authUser: (req, res, next) => {
    const user = helpers.getUser(req)
    if (user) {
      if (user.role !== 'admin') return next()
      return res.json({ status: 'failure', message: 'permission denied' })
    }
    return res.json({ status: 'failure', message: 'permission denied' })
  },
  authUserSelf: (req, res, next) => {
    const userSelf = helpers.getUser(req)
    const otherUserId = req.params.id
    if (userSelf) {
      if (userSelf.id === otherUserId) return next()
      return res.json({ status: 'failure', message: 'permission denied' })
    }
    return res.json({ status: 'failure', message: 'permission denied' })
  }
}
