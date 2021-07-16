const jwt = require('jsonwebtoken')

const { User } = require('../models')

const passport = require('../config/passport')
const helpers = require('../_helpers')

const RequestError = require('../utils/customError')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) return next(err)
    if (!user) return next(new RequestError('no user'))
    req.user = { ...user.dataValues }
    return next()
  })(req, res, next)
}

const checkRole = (role = 'user') => {
  return (req, res, next) => {
    if (helpers.getUser(req).role) {
      if (helpers.getUser(req).role !== role) {
        return next(new RequestError('Permission denied.'))
      }
    }
    return next()
  }
}

const socketAuth = (socket, next) => {
  if (socket.handshake.auth == null || socket.handshake.auth.token == null) {
    return next(new RequestError('user\'s token required.'))
  }

  const token = socket.handshake.auth.token

  jwt.verify(token, process.env.JWTSECRET, async (err, decoded) => {
    if (err) return next(new RequestError('jwt auth error.'))
    socket.user = (await User.findByPk(decoded.id, {
      attributes: [
        'id', 'name', 'avatar'
      ]
    })).toJSON()
    next()
  })
}

module.exports = {
  authenticated,
  checkRole,
  socketAuth
}
