// 載入所需套件
const passport = require('../config/passport')
const helpers = require('../_helpers')
const jwt = require('jsonwebtoken')
const { User } = require('../models')


module.exports = {
  authenticated: (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) { return next(err) }
      if (!user) {
        return res.status(401).json({ status: 'error', message: '帳號不存在！' })
      }
      req.user = user // 把user資料塞到req.user裡面
      return next()
    })(req, res, next)
  },

  checkNotAdmin: (req, res, next) => {
    if (helpers.getUser(req).role === 'admin') {
      return res.status(401).json({ status: 'error', message: '帳號不存在' })
    }
    return next()
  },

  checkNotUser: (req, res, next) => {
    if (helpers.getUser(req).role === 'user') {
      return res.status(401).json({ status: 'error', message: '帳號不存在' })
    }
    return next()
  },

  socketAuth: (socket, next) => {
    const token = socket.handshake.auth.token
    const SECRET = process.env.JWT_SECRET

    jwt.verify(token, SECRET, async (err, decoded) => {
      const user = (await User.findByPk(decoded.id, {
        attributes: ['id', 'account', 'name', 'avatar'],
      })).toJSON()
      socket.user = user
      return next()
    })
  }
}