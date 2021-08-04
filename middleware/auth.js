const helpers = require('../_helpers')
const passport = require('../config/passport')
const jwt = require('jsonwebtoken')
const { User } = require('../models')
module.exports = {
  authenticated: (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
      if (err || !user) {
        return res.status(401).json({ status: 'error', message: 'Unauthorized' })
      }
      req.user = user // JWT 沒有使用 session，所以需要手動設置
      return next()
    })(req, res, next)
  },
  authenticatedAdmin: (req, res, next) => {
    if (helpers.getUser(req)) {
      if (helpers.getUser(req).role === 'admin') {
        return next()
      }
      return res.json({ status: 'error', message: 'permission denied' })
    } else {
      return res.json({ status: 'error', message: 'permission denied' })
    }
  },

  authenticatedNotAdmin: (req, res, next) => {
    if (helpers.getUser(req).role === 'admin') {
      return res.json({ status: 'error', message: '管理者請從後台登入' })
    } else {
      return next()
    }
  },
  socketAuthenticated: async (socket, next) => {
    const token = socket.handshake.auth.token

    jwt.verify(token, 'alphacamp', async (err, decoded) => {
      if (err) {
        console.log(err.message)
        return next(new RequestError('jwt auth error.'))
      }

      if (socket.handshake.auth == null || socket.handshake.auth.token == null) {
        console.log('no handshake.auth')
        return next(new RequestError("user's token required."))
      }

      socket.handshake.user = await User.findByPk(decoded.id, {
        attributes: ['id', 'name', 'avatar', 'account']
      })
      next()
    })
  }
}
