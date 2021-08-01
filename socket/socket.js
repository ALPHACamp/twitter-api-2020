const socketio = require('socket.io')
const { authenticatedSocket } = require('../middleware/auth')
const socketController = require('../controllers/socket/socketController')
const chalk = require('chalk')
const notice = chalk.cyanBright.underline.italic
module.exports = (server) => {
  const io = socketio(server, {
    cors: {
      origin: ['http://localhost:8080', 'https://ryanhsun.github.io'],
      credentials: true
    },
    allowEIO3: true
  })
  io.use(authenticatedSocket).on('connection', async (socket) => {
    /* connect */
    socketController.postSocket(socket)
    const getMsgNotice = await socketController.getMsgNotice(null, socket)
    socket.emit('get_msg_notice', getMsgNotice)
    socket.on('sendMessage', (data) => console.log(data))
    /* disconnect */
    socket.on('disconnecting', () => {
      socketController.deleteSocket(socket, io)
    })

    /* join public room */
    socket.on('join_public_room', async ({ userId }) => {
      socketController.joinPublicRoom(userId, socket, io)
    })
    /* leave public room */
    socket.on('leave_public_room', ({ userId }) => {
      socketController.leavePublicRoom(userId, socket, io)
    })
    /* get public history */
    socket.on('get_public_history', async ({ offset, limit }, cb) => {
      console.log(notice('伺服器收到事件 get_public_history'))
      const messages = await socketController.getPublicHistory(offset, limit)
      cb(messages)
    })
    /* public message (get and send) */
    socket.on('post_public_msg', ({ content, userId }) => {
      socketController.postPublicMsg(content, userId, socket)
    })
    /* join private page */
    socket.on('join_private_page', async ({ userId }) => {
      socketController.joinPrivatePage(userId, socket)
    })
    /* leave private page */
    socket.on('leave_private_page', () => {
      socketController.leavePrivatePage(socket)
    })
    /* join private room */
    socket.on('join_private_room', async ({ User1Id, User2Id }) => {
      const RoomId = await socketController.joinPrivateRoom(
        User1Id,
        User2Id,
        socket, io
      )
      //return roomId to client
      socket.emit('join_private_room', RoomId)
      console.log('emit join_private_room to user', RoomId)
    })

    /* get private history */
    socket.on('get_private_history', async ({ offset, limit, RoomId }, cb) => {
      console.log(notice('伺服器收到事件 get_private_history'))
      const messages = await socketController.getPrivateHistory(
        offset,
        limit,
        RoomId
      )
      cb(messages)
    })
    /* private message (get and send) */
    socket.on(
      'post_private_msg',
      async ({ SenderId, ReceiverId, RoomId, content }) => {
        socketController.postPrivateMsg(
          SenderId,
          ReceiverId,
          RoomId,
          content,
          socket
        )
      }
    )
  })
}
