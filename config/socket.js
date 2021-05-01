const jwt = require('jsonwebtoken')
const db = require('../models/index')
const secretOrKey = process.env.JWT_SECRET
const User = db.User

async function decode (token) {
  try {
    const payload = await jwt.verify(token, secretOrKey)
    if (payload.id) {
      return payload.id
    }
    return null
  } catch (error) {
    console.log(error)
    return null
  }
}

const socket = (httpServer) => {
  const options = {
    allowEIO3: true,
    cors: {
      origin: 'http://localhost:8080',
      methods: ['GET', 'POST'],
      credentials: true
    }
  }
  const io = require('socket.io')(httpServer, options)

  // authenticate user
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.query.token
      if (!token) {
        socket.emit('error', 'No token, please log in first.')
        socket.disconnect()
        return next(new Error('No token'))
      }

      const id = await decode(token)
      if (!id) {
        socket.emit('error', 'Not authorized, please log in first.')
        socket.disconnect()
        return next(new Error('Not authorized'))
      }

      const user = await User.findByPk(id, { attributes: ['id', 'name', 'avatar'] })
      if (!user) {
        socket.emit('error', 'User not found, please log in first.')
        socket.disconnect()
        return next(new Error('User not found'))
      }
      socket.user = user.toJSON()
      next()
    } catch (error) {
      console.log(error)
      socket.emit('error', 'Something wrong, please try again later.')
      socket.disconnect()
      return next(new Error(error.toString()))
    }
  })

  io.on('connection', async (socket) => {
    console.log('客戶端有連接')

    socket.on('connect', () => {
      console.log('客戶端開始連接')
      console.log(socket)
    })

    socket.on('disconnect', () => {
      console.log('客戶端停止連接')
    })

    socket.emit('welcome', '歡迎連接 socket')

    socket.on('hello', (message) => {
      console.log('客戶端回傳訊息：', message)
      const data = {
        id: null,
        message,
        time: Date.now(),
        user: socket.user
      }
      socket.broadcast.emit('welcome', data)
    })
  })
}

module.exports = socket
