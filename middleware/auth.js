const passport = require('../config/passport')
const jwt = require('jsonwebtoken')
const { User } = require('../models')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) return next(err)
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'authenticated error : no user'
      })
    }
    req.user = { ...user.dataValues }
    next()
  })(req, res, next)
}

const authenticatedAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'user') {
    return res.status(401).json({
      status: 'error',
      message: '帳號不存在'
    })
  }
  next()
}
const checkRoleIsUser = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return res.status(401).json({
      status: 'error',
      message: '無帳戶'
    })
  }
  next()
}
const authenticatedSocket = (socket, next) => {
  if (socket.handshake.auth == null || socket.handshake.auth.token == null) {
    console.log('no handshake.auth')
    return next(new RequestError('user\'s token required.'))
  }

  if (socket.handshake.auth && socket.handshake.auth.token) {
    const token = socket.handshake.auth.token
    const SECRET = process.env.JWT_SECRET
    jwt.verify(
      token,SECRET, async (err, decoded) => {
        if (err) {
          console.log(err.message)
          return next(new RequestError('jwt auth error.'))
        }
        socket.user = (await User.findByPk(decoded.id, {
          attributes:[
            'id', 'name', 'avatar', 'account'
          ]
        })).toJSON()
        next()
      }
    )
  }
}

module.exports = {
  authenticated,
  authenticatedAdmin,
  checkRoleIsUser,
  authenticatedSocket
}
