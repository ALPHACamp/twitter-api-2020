// const chatController = require('../controllers/chatController')
const { User, Chat, Chatroom } = require('../models')
// const helpers = require('../_helpers')

const io = (http) => {

  const io = require('socket.io')(http, {
    cors: {
      origin: "*"
    }
  })

  io.use((socket, next) => {
    require('../_helpers')
    next();
  });
  let users = {}
  io.on('connection', (socket) => {
    socket.on('user', (data) => {
      users = data
      socket.broadcast.emit('chat message', `${data.name}上線`);
    })

    socket.on('chat message', async (msg) => {
      await Chat.create({
        UserId: users.id,
        message: content,
        ChatroomId: 5
      })
      io.emit('chat message', `${users.name}: ${msg}`);
    });
    socket.on('disconnect', () => {
      const leaveId = socket.id
      // console.log('leave', leaveId)
      io.emit('chat message', `${users.name}離開聊天室`)
    })


    // socket.on('private message', async (anotherSocketId, msg) => {
    //   // await Chat.create({
    //   //   UserId: users.UserId,
    //   //   message: msg,
    //   //   ChatroomId: users.ChatroomId
    //   // })
    //   io.emit('private message', socket.id, `${socket.id}: ${msg}`);
    // });

  })
}

module.exports = { io }