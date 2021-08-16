const socketio = require('socket.io')
const { authenticatedSocket } = require('../middleware/auth')
const socketController = require('../controllers/socket/socketController')
const socketService = require('../service/socketService')
const chalk = require('chalk')
const notice = chalk.keyword('aqua').underline
const detail = chalk.keyword('powderblue')
module.exports = (server) => {
  const io = socketio(server, {
    cors: {
      origin: [
        'http://localhost:8080',
        'http://localhost:8081',
        'https://ryanhsun.github.io'
      ],
      credentials: true
    },
    allowEIO3: true
  })
  io.use(authenticatedSocket).on('connection', async (socket) => {
    /* connect */
    socketService.showUserOnline(socket)
    socketService.addNewSocketUserTimelineSeenAt(socket)
    await socketService.showAllSocketDetails(io)

    /* ================= EMITS ================= */
    socket.emit('message', `Your socket id is  ${socket.id}`)
    /* Message Notice */
    const getMsgNotice = await socketService.getMsgNotice(null, socket)
    socket.emit('get_msg_notice', getMsgNotice)
    console.log(notice(`[EMIT] get_msg_notice → ${socket.id}`))

    /* ================= LISTENERS ================= */
    socket.on('sendMessage', (data) => console.log(data))

    /* disconnect */
    socket.on('disconnecting', () => {
      socketService.deleteAndUpdateTimelineSeenAt(socket, io)
      socketService.showUserOffline(socket.id)
    })
    /* ---------------- PUBLIC ROOM ---------------- */
    socket.on('join_public_room', async ({ userId }) => {
      console.log(notice('[ON EVENT] join_public_room'))
      socketController.joinPublicRoom(socket, io)
    })
    socket.on('leave_public_room', ({ userId }) => {
      console.log(notice('[ON EVENT] leave_public_room'))
      socketController.leavePublicRoom(socket, io)
    })
    socket.on('get_public_history', async ({ offset, limit }, cb) => {
      console.log(notice('[ON EVENT] get_public_history\n'), { offset, limit })
      const messages = await socketService.getRoomHistory(offset, limit, 1) //roomId 1 is PublicRoom
      cb(messages)
    })
    socket.on('post_public_msg', ({ content, userId }) => {
      console.log(notice('[ON EVENT] post_public_msg', { content, userId }))
      socketController.postPublicMsg(content, socket)
    })
    /* ---------------- PRIVATE PAGE ---------------- */
    socket.on('join_private_page', async ({ userId }) => {
      console.log(notice('[ON EVENT] join_private_page'))
      socketController.joinPrivatePage(socket, io, false)
    })
    socket.on('leave_private_page', () => {
      console.log(notice('[ON EVENT] leave_private_page'))
      socketController.leavePrivatePage(socket, io)
    })
    socket.on('join_private_room', async ({ User1Id, User2Id, RoomId }) => {
      console.log(notice('[ON EVENT] join_private_room'), { User1Id, User2Id })
      RoomId = await socketController.joinPrivateRoom(
        User1Id,
        User2Id,
        RoomId,
        socket,
        io
      )
      //return roomId to client
      socket.emit('join_private_room', RoomId)
      console.log(
        notice(`[EMIT] join_private_room RoomId: ${RoomId} → ${socket.id}`)
      )
    })
    socket.on('get_private_history', async ({ offset, limit, RoomId }, cb) => {
      console.log(notice('[ON EVENT] get_private_history\n'), {
        offset,
        limit,
        RoomId
      })
      const messages = await socketService.getRoomHistory(offset, limit, RoomId)
      cb(messages)
    })
    socket.on(
      'post_private_msg',
      async ({ SenderId, ReceiverId, RoomId, content }) => {
        console.log(notice('[ON EVENT] post_private_msg\n'), {
          SenderId,
          ReceiverId,
          RoomId,
          content
        })
        socketController.postPrivateMsg(
          SenderId,
          ReceiverId,
          RoomId,
          content,
          socket,
          io
        )
      }
    )
    socket.on('get_private_rooms', async ({ offset, limit }, cb) => {
      console.log(notice('[ON EVENT] get_private_rooms\n'), { offset, limit })
      const rooms = await socketService.getPrivateRooms(
        socket.data.user.id,
        offset,
        limit
      )
      cb(rooms)
    })
    /* ---------------- TIMELINE ---------------- */
    socket.on('join_timeline_page', ({ timestamp }) => {
      socket.join('TimelinePage')
      socketService.seenTimeline(socket.data.user.id, timestamp)
      /* logs */
      console.log(notice('[ON EVENT] join_timeline_page'))
      console.log(
        detail(`${socket.id}room result:\n`),
        Array.from(socket.rooms)
      )
    })
    socket.on('leave_timeline_page', () => {
      socket.leave('TimelinePage')
      /* logs */
      console.log(notice('[ON EVENT] leave_timeline_page'))
      console.log(
        detail(`${socket.id}room result:\n`),
        Array.from(socket.rooms)
      )
    })
    socket.on('get_timeline_notice_details', async ({ offset, limit }, cb) => {
      console.log(notice('[ON EVENT] get_timeline_notice_details'))
      const results = await socketService.getTimelineNoticeDetails(
        offset,
        limit,
        socket
      )
      cb(results)
    })
    socket.on('read_timeline', async ({ timelineId }) => {
      console.log(notice('[ON EVENT] read_timeline'))
      await socketService.readTimeline(timelineId)
    })
    socket.on('post_timeline', async ({ ReceiverId, type, PostId }) => {
      console.log(notice('[ON EVENT] post_timeline\n'), { ReceiverId, type, PostId })
      await socketController.postTimeline(ReceiverId, type, PostId, socket, io)
    })
  })
}
