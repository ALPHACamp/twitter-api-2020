const helpers = require('../_helpers')
const jwt = require('jsonwebtoken')
const passport = require('../config/passport')
const apiError = require('../libs/apiError')
const { User } = require('../models')

const authenticated = (req, res, next) =>
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) {
      return new Error(err)
    }
    // Check if the user exists
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Access denied' })
    }
    req.user = user.dataValues

    return next()
  })(req, res, next)

const checkRole = (role = 'user') => {
  return (req, res, next) => {
    if (helpers.getUser(req).role) {
      if (helpers.getUser(req).role !== role) {
        return res.status(403).json({
          status: 'error',
          message: 'Access denied',
        })
      }
    }
    return next()
  }
}

const authenticatedSocket = (socket, next) => {
  console.log('== authenticating socket ==')
  console.log('socket.handshake.auth', socket.handshake.auth)
  

  if (socket.handshake.auth && socket.handshake.auth.token) {
    jwt.verify(
      socket.handshake.auth.token,
      process.env.JWT_SECRET,
      (err, decoded) => {
        if (err) return apiError.badRequest(401, 'Socket authenticate error')
        socket.userId = decoded.id
        console.log(socket.userId)
        next()
      }
    )
  }
  
}

module.exports = { authenticated, checkRole, authenticatedSocket }
