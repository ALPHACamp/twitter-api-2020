const generateMessage = require('./message')
const { Message } = require('./models')

const socket = httpServer => {
  // const io = require('socket.io')(httpServer, {
  //   cors: {
  //     origin: 'http://localhost:8080' // 這是前後分離時前端使用的 port
  //   }
  // })

  const io = require('socket.io')(httpServer)

  io.on('connection', socket => {
    // join
    socket.on('join', ({ username, roomId, userId }) => {
      console.log('roomId: ', roomId)
      // console.log('username: ', username)
      socket.join(roomId)

      // welcome the user when joining
      socket.emit('message', 'Welcome')

      console.log('username: ', username)
      // notify everyone except the user
      socket.broadcast.to(`${roomId}`).emit('message', `${username} is joined `)
    })

    socket.on('chat message', async ({ msg, userId, roomId, username }) => {
      await Message.create({
        userId: userId,
        chatRoomId: roomId,
        message: msg
      })

      await io.to(`${roomId}`).emit('chat message', generateMessage({ msg, username }))
    })
  })
}

module.exports = socket
