const passport = require('../config/passport')


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
    console.log(socket.handshake)
    console.log('no handshake.auth')
    return next(new RequestError('user\'s token required.'))
  }
  console.log('socket.handshake', socket.handshake)
  console.log('socket.handshake.auth', socket.handshake.auth)
  if (socket.handshake.auth && socket.handshake.auth.token) {
    jwt.verify(
      socket.handshake.auth.token,
      process.env.JWTSECRET,
      (err, decoded) => {
        if (err) {
          console.log(err.message)
          return next(new RequestError('jwt auth error.'))
        }
        socket.userId = decoded.id
        console.log('socket.userId', socket.userId)
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
