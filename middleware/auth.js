const jwt = require('jsonwebtoken')

const passport = require('../config/passport')

module.exports = {
  authenticated: (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
      if (!user) {
        return res
          .status(401)
          .json({
            status: 'error',
            message: 'No jwt token'
          })
      }
      req.user = user
      return next()
    })(req, res, next)
  },

  authenticatedAdmin: (req, res, next) => {
    if (req.user && req.user.role === 'admin') return next()
    return res
      .status(401)
      .json({
        status: 'error',
        message: 'permission denied'
      })
  },

  authenticatedUser: (req, res, next) => {
    if (req.user && req.user.role === 'user') return next()
    return res
      .status(401)
      .json({
        status: 'error',
        message: 'permission denied'
      })
  },

  authenticatedSocket: (socket, next) => {
    console.log('==== authenticatedSocket ====')
    console.log('socket.handshake.auth', socket.handshake.auth)
    if (socket.handshake.auth && socket.handshake.auth.token) {
      jwt.verify(
        socket.handshake.auth.token,
        process.env.JWT_SECRET,
        (err, decoded) => {
          if (err) return next(new Error('Authentication error'))
          socket.userId = decoded.id
          console.log('socket.userId', socket.userId)
          next()
        }
      )
    }
  }
}
