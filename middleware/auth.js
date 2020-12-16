const passport = require('passport')
const helpers = require('../_helpers')

module.exports = {
  authenticated: passport.authenticate('jwt', { session: false }),
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
      if (user.role === 'user') return next()
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
