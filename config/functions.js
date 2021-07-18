const jwt = require('jsonwebtoken')
module.exports = {
  randomDate: (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  },
  socketAuthenticated: async (socket, next) => {
    const token = socket.handshake.query.token
    if (!token) return
    if (socket.handshake.query && token) {
      jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        try {
          if (err) return next(new Error('Authentication error'))
          socket.decoded = decoded
          socket.userId = decoded.id
          next()
        } catch (err) {
          console.log(err)
        }
      })
      next()
    } else {
      next(new Error('Authentication error'))
    }
  }
}
