// const chatController = require('../controllers/chatController')
const { User, Chat, Chatroom } = require('../models')
// const helpers = require('../_helpers')

const io = (server) => {

  const io = require('socket.io')(server)

  io.use((socket, next) => {
    require('../_helpers')
    next();
  });

  io.on('connection', async (socket) => {
    // console.log(socket.handshake)
    socket.data.username = "alice"
    // console.log(socket.data)
    socket.broadcast.emit('chat message', `${socket.id}上線`);
    await socket.on('chat message', async (msg) => {
      await Chat.create({
        UserId: 15,
        message: msg.message,
        ChatroomId: msg.ChatroomId
      })
      io.emit('chat message', `${socket.id}: ${msg.message}_${socket.handshake.time}`);
    });

    socket.on('disconnect', () => {
      console.log('out', socket.data)
      io.emit('chat message', `${socket.id}離開聊天室`)
    })

  })
}

module.exports = { io }