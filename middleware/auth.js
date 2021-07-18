const passport = require('passport')
const helper = require('../_helpers')
const jwt = require('jsonwebtoken')
const db = require('../models')
const User = db.User

module.exports = {
  authenticated: (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
      if (!user) {
        return res
          .status(403)
          .json({ status: 'error', message: 'Permission is denied.' })
      }
      req.user = user
      return next()
    })(req, res, next)
  },
  authenticatedAdmin: (req, res, next) => {
    req.user = helper.getUser(req)
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Permission is denied, only Administrator can visit.'
      })
    }
    return next()
  },
  authenticatedUser: (req, res, next) => {
    req.user = helper.getUser(req)
    if (req.user.role == 'user' || !req.user.role) {
      return next()
    }
    return res.status(403).json({
      status: 'error',
      message: 'Permission is denied, only User can visit.'
    })
  },
  authenticatedSocket: (socket, next) => {
    if (socket.handshake.query && socket.handshake.query.auth) {
      jwt.verify(
        socket.handshake.query.auth,
        'numberFive',
        async (err, decoded) => {
          if (err) {
            return next(new Error('Authentication error'))
          }
          socket.decoded = decoded
          const options = {
            attributes: ['id', 'name', 'account', 'avatar']
          }
          let user = await User.findByPk(decoded.id, options)
          user = user.toJSON()
          user.socketId = socket.id
          socket.request.user = user
          return next()
        }
      )
    }
  }
}
