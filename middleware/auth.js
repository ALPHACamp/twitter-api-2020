const passport = require('../config/passport')
const helpers = require('../_helpers')

module.exports = {
  authenticate: (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) return next(err)
      if (!user) return res.status(401).json({ message: info.message })
      req.user = user
      return next()
    })(req, res, next)
  },
  authAdmin: (req, res, next) => {
    const user = helpers.getUser(req)
    if (user) {
      if (user.role === 'admin') return next()
      return res.status(403).json({ message: 'permission denied' })
    }
    return res.status(403).json({ message: 'permission denied' })
  },
  authUser: (req, res, next) => {
    const user = helpers.getUser(req)
    if (user) {
      if (user.role !== 'admin') return next()
      return res.status(403).json({ message: 'permission denied' })
    }
    return res.status(403).json({ message: 'permission denied' })
  },
  authUserSelf: (req, res, next) => {
    const userSelf = helpers.getUser(req)
    const otherUserId = Number(req.params.id)
    if (userSelf) {
      if (userSelf.id === otherUserId) return next()
      return res.status(403).json({ message: 'permission denied' })
    }
    return res.status(403).json({ message: 'permission denied' })
  }
}
