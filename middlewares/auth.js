const passport = require('../config/passport')
const helpers = require('../_helpers')
const ApiError = require('../utils/customError')
const jwt = require('jsonwebtoken')
const { User } = require('../models')

const authenticated = (req, res, next) =>
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) {
      return next(new ApiError('AuthenticatedError', 401, 'Unauthorized'))
    }
    req.user = user.dataValues

    return next()
  })(req, res, next)

// authenticatedRole() to verify req is user
// authenticatedRole('admin') to verify req is admin
const authenticatedRole = (role = 'user') => {
  return (req, res, next) => {
    if (helpers.getUser(req).role) {
      if (helpers.getUser(req).role !== role) {
        return next(
          new ApiError('AuthenticatedRoleError', 403, 'Permission denied')
        )
      }
    }
    return next()
  }
}

const socketAuthenticated = (socket, next) => {
  // FIXME: The location of the token may be problematic
  // TODO: The frontend should put user/token information into socket.auth
  // TODO: socket.handshake.auth.token

  const token = socket.handshake.headers.token || socket.handshake.auth.token

  // token == null is true if the value of a is null or undefined.
  if (token == null) {
    return next(
      new ApiError('SocketAuthenticatedError', 401, 'Token does not exist')
    )
  }

  jwt.verify(token, process.env.JWT_SECRET, async function (err, decoded) {
    if (err) {
      return next(new ApiError('SocketAuthenticatedError', 401, 'Unauthorized'))
    }
    socket.user = await User.findByPk(decoded.id, {
      raw: true,
      attributes: ['id', 'name', 'avatar', 'account', 'lastLogin']
    })
    return next()
  })
}

module.exports = { authenticated, authenticatedRole, socketAuthenticated }
