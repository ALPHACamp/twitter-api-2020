const passport = require('../config/passport')
const helpers = require('../_helpers')
const { User } = require('../models')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, async (err, user) => {
    if (err || !user) return res.status(401).json({ status: 'error', message: 'unauthorized' })
    // req.user = user.dataValues
    const { id } = user.dataValues
    await User.findByPk(id)
      .then(user => {
        req.user = user.toJSON()
      })
      .catch(err => next(err))
    next()
  })(req, res, next)
}

// 登入狀態驗證
const authenticatedStatus = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.json({ status: 'unauthorized' })
    return res.json({ status: 'authorized' })
  })(req, res, next)
}

const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req) && (helpers.getUser(req).role === 'admin')) return next()
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}

// 加入前端驗證
const authenticatedUser = (req, res, next) => {
  if (helpers.getUser(req) && (helpers.getUser(req).role === 'user')) return next()
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}

module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticatedUser,
  authenticatedStatus
}
