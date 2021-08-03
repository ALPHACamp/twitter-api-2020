const socketService = require('../../service/socketService')
const chalk = require('chalk')
const highlight = chalk.bgYellow.black
const notice = chalk.bgBlue.white
const detail = chalk.magentaBright

let socketController = {
  postSocket: (socket) => {
    socketService.addNewSocketUser(socket)
    socketService.showNewUserOnline(socket.id)
    socket.emit('message', `Your socket id is  ${socket.id}`)
  },
  deleteSocket: (socket, io) => {
    if (socketService.getPrivateRoomUserInfo(socket.id)) {
      socketService.removeUserFromPrivateRoom(socket.id)
      socketService.showLeavePrivatePageNotice(socket.id)
    }
    if (socketService.checkSocketIdInPublicRoom(socket.id)) {
      socketService.showLeavePublicRoomNotice(null, socket.id)
      socketService.removeUserFromPublicRoom(socket.id)
      const users = socketService.publicRoomUsers(socket.id)
      io.emit('online_users', {
        users,
      })
    }
    if (socketService.checkSocketExists(socket)) {
      socketService.removeSocketFromList(socket)
    }
    socketService.showUserOffline(socket.id)
  },
  joinPublicRoom: async (userId, socket, io) => {
    socketService.showJoinPublicRoomNotice(userId, socket.id)
    socketService.addSocketIdToPublicRoom(socket.id)
    const ids = await io.allSockets()
    socketService.showAllSocketDetails(ids)
    const user = socketService.getUserInfo(socket.id)
    io.emit('new_join', {
      name: user.name,
    })
    const users = socketService.getPublicRoomUsers(socket.id)
    io.emit('online_users', {
      users,
    })
  },
  joinPrivatePage: async function (userId, socket) {
    console.log(notice(`join_private_page: ${userId}`))
    console.log(notice(`join_private_page-socketId ${socket.id}`))
    socketService.addUserInfoToPrivateRoomSockets(userId, socket.id)
    await socketService.toggleSeenMsgRecord(userId)
    //emit get_private_rooms
    const rooms = await socketService.getPrivateRooms(userId)
    socket.emit('get_private_rooms', rooms)
    const getMsgNoticeDetails = await socketService.getMsgNoticeDetails(userId)
    socket.emit('get_msg_notice_details', getMsgNoticeDetails)
  },
  joinPrivateRoom: async (User1Id, User2Id, socket, io) => {
    console.log(notice(`join_private_room:`), { User1Id, User2Id })
    /* if miss join_private_page */
    if (!socketService.getPrivateRoomUserInfo(socket.id)) {
      console.log(notice(`[補] join_private_page: ${User1Id}`))
      console.log(notice(`join_private_page-socketId ${socket.id}`))
      socketService.addUserInfoToPrivateRoomSockets(User1Id, socket.id)
    }
    await socketService.toggleReadPrivateMsg(User1Id, User2Id)
    const roomId = await socketService.getRoomId(User1Id, User2Id)
    socketService.setPrivateRoomId(socket.id, roomId)
    console.log(detail(`set ${socket.id} new roomId to ${roomId}`))

    // 找到User2 的socketId
    // check isOnline or not
    const user2Sockets = socketService.getUserSocketIds(User2Id)
    if (user2Sockets) {
      //join User1 into room
      socket.join(roomId)
      //join User2 into room
      console.log(detail(`user2的socket:`), user2Sockets)
      socketService.addUserToRoom(user2Sockets, roomId)
    }
    const ids = await io.allSockets()
    socketService.showAllSocketDetails(ids)
    console.log(detail(`最後roomId結果: ${roomId} `))
    return roomId
  },
  leavePublicRoom: (userId, socket, io) => {
    socketService.showLeavePublicRoomNotice(userId)

    socketService.removeUserFromPublicRoom(socket.id)
    const user = socketService.getUserInfo(socket.id)
    io.emit('user_leave', {
      name: user.name,
    })
    const users = socketService.getPublicRoomUsers()
    io.emit('online_users', {
      users,
    })
  },
  leavePrivatePage: (socket) => {
    //去除privateRoomUsers內要離開的使用者
    if (socketService.getPrivateRoomUserInfo(socket.id)) {
      console.log(
        notice(`leave_private_page: `),
        socketService.getPrivateRoomUserInfo(socket.id)
      )
      socketService.removeUserFromPrivateRoom(socket.id)
    }
  },
  getPublicHistory: async (offset, limit) => {
    socketService.showGetPublicHistoryNotice()
    //roomId 1 is PublicRoom
    const publicRoomId = 1
    return await socketService.getRoomHistory(offset, limit, publicRoomId)
  },
  getPrivateHistory: async (offset, limit, RoomId) => {
    console.log(notice(`get_private_history:`), { offset, limit, RoomId })
    const messages = await socketService.getRoomHistory(offset, limit, RoomId)
    return messages
  },
  postPublicMsg: async (content, userId, socket) => {
    const publicRoomId = 1
    socketService.showPostPublicHistoryNotice(content, userId)
    if (!content) {
      return
    }
    const message = await socketService.addMessage(
      userId,
      publicRoomId,
      content
    )
    const user = socketService.getUserInfo(socket.id)
    socket.broadcast.emit('get_public_msg', {
      content: message.content,
      createdAt: message.createdAt,
      avatar: user.avatar,
    })
  },
  postPrivateMsg: async (SenderId, ReceiverId, RoomId, content, socket) => {
    console.log(notice(`post_private_msg:`), {
      SenderId,
      ReceiverId,
      RoomId,
      content,
    })
    if (!content) {
      return
    }
    const user = socketService.getUserInfo(socket.id)
    const message = await socketService.addMessage(SenderId, RoomId, content)
    const isUserOnline = socketService.getUserSocketIds(ReceiverId)
    const isReceiverOnPrivatePage =
      socketService.checkReceiverOnPrivatePage(ReceiverId)
    /* no update record */
    /* Receiver is  in room */ //Receiver在聊天室裡
    if (
      isReceiverOnPrivatePage &&
      isReceiverOnPrivatePage.includes(message.RoomId)
    ) {
      let createdAt = message.createdAt
      const avatar = user.avatar
      socket.to(RoomId).emit('get_private_msg', {
        UserId: SenderId,
        RoomId,
        content,
        avatar,
        createdAt,
      })
      return 
    }
    /* update record */
    let record = await socketService.getMsgRecord(RoomId, SenderId)
    if (!record) {
      record = await socketService.createMsgRecord(RoomId, SenderId, ReceiverId)
    }
    /* Receiver is online */
    if (isUserOnline) {
      /* Receiver is on private page  */
      if (isReceiverOnPrivatePage) {
        /* Receiver is not in room */ //Receiver在其它聊天室裡
        record.increment({ unreadNum: 1 })
        await record.save()
        const [rooms, getMsgNoticeDetails] = await Promise.all([
          await socketService.getPrivateRooms(ReceiverId)
          ,
          await socketService.getMsgNoticeDetails(
            ReceiverId
          )
        ])
        isUserOnline.forEach((socketid) => {
          socket.to(socketid).emit('get_private_rooms', rooms)
          socket
            .to(socketid)
            .emit('get_msg_notice_details', getMsgNoticeDetails)
        })
        return 
      }
      /* Receiver is not on private page  */
      record.isSeen = false
      record.increment({ unreadNum: 1 })
      await record.save()
      const getMsgNotice = await socketService.getMsgNotice(ReceiverId, null)
      isUserOnline.forEach((socketid) => {
        socket.to(socketid).emit('get_msg_notice', getMsgNotice)
      })
      return 
    }
    /* Receiver is not online */
    record.increment({ unreadNum: 1 })
    await record.save()
    return
  },
}

module.exports = socketController
