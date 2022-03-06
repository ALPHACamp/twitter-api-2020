const passport = require('../config/passport')
const helper = require('../_helpers')
const jwt = require('jsonwebtoken')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ status: 'error', message: 'Unauthorized' })
    if (user.role) req.user = user.toJSON()
    next()
  })(req, res, next)
}

const authenticatedAdmin = (req, res, next) => {
  const user = helper.getUser(req)

  if (user && user.role === 'admin') return next()
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}

const authenticatedSocket = (socket, next) => {
  console.log('========== SOCKET AUTH ==========')
  console.log('socket.handshake', socket.handshake)
  console.log('sock.handshake.auth', socket.handshake.auth.token)
  if (socket.handshake.auth?.token) {
    jwt.verify(
      socket.handshake.auth.token,
      process.env.JWT_SECRET,
      async (err, decoded) => {
        try {
          if (err) return next(new Error('Authentiaction Error'))
          socket.userId = decoded.id
          console.log('socket.usrId', socket.userId)
          next()
        } catch (err) { next(err) }
      } 
    )
  }
}

module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticatedSocket
}