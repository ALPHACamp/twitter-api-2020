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

    let user = {}
    socket.on('user', (data) => {
      user = data
      user[socket.id] = data.UserId
      console.log(user)
      io.emit('chat message', `${data.name}上線`);
    })

    await socket.on('chat message', async (msg) => {
      await Chat.create({
        UserId: user.UserId,
        message: msg,
        ChatroomId: user.ChatroomId
      })
      io.emit('chat message', `${user.name}: ${msg}`);
    });

    socket.on('disconnect', () => {
      io.emit('chat message', `${user.name}離開聊天室`)
      user = {}
    })

  })
}

module.exports = { io }