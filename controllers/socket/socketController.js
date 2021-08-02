const socketService = require('../../service/socketService')
const sockets = [] // array of sockets  找到對應的socket物件
const socketUsers = {} // key(socketid) to value(id, name, account, avatar) 利用socketid可以找到對應使用者
const publicRoomUsers = [] // array of userIds 公開聊天室的socketId
let privateRoomUsers = {} // key(socketid) to value(id, currentRoom)
const db = require('../../models')
const User = db.User
const Room = db.Room
const Message = db.Message
const MessageRecord = db.MessageRecord
const sequelize = require('sequelize')
const { Op } = require('sequelize')
const chalk = require('chalk')
const highlight = chalk.bgYellow.black
const notice = chalk.bgBlue.white
const detail = chalk.magentaBright

let socketController = {
  postSocket: (socket) => {
    const currentUser = socket.request.user
    /* connect */
    // 儲存socket物件
    sockets.push(socket)
    // 建立socketId 與使用者資訊的對照表
    socketUsers[socket.id] = {
      id: currentUser.id,
      name: currentUser.name,
      account: currentUser.account,
      avatar: currentUser.avatar
    }
    console.log(
      highlight(
        ` User is online: ${socketUsers[socket.id].name} / ${socket.id}`
      )
    )
    socket.emit('message', `Your socket id is  ${socket.id}`)
  },
  deleteSocket: (socket, io) => {
    if (socketService.getPrivateRoomData(socket.id)) {
      socketService.deletePrivateUser(socket.id)
      console.log(notice(`leave Private Page: ${socketUsers[socket.id].id}`))
    }
    if (publicRoomUsers.includes(socket.id)) {
      console.log(notice(`leave PublicRoom: ${socketUsers[socket.id].id}`))
      publicRoomUsers.splice(publicRoomUsers.indexOf(socket.id), 1)
      const users = helper.getPublicRoomUsers()
      io.emit('online_users', {
        users
      })
    }
    if (sockets.includes(socket)) {
      sockets.splice(sockets.indexOf(socket), 1)
    }
    delete socketUsers[socket.id]
    console.log(highlight(`User is offline: ${socket.id}`))
  },
  joinPublicRoom: async (userId, socket, io) => {
    socketService.showJoinPublicRoomNotice(userId, socket.id)
    socketService.addToPublicRoom(socket.id)
    const ids = await io.allSockets()
    socketService.showJoinPublicRoomDetail(ids)
    const user = socketService.getUserInfo(socket.id)
    io.emit('new_join', {
      name: user.name
    })
    const users = socketService.getPublicRoomUsers(socket.id)
    io.emit('online_users', {
      users
    })
  },
  joinPrivatePage: async function (userId, socket) {
    console.log(notice(`join_private_page: ${userId}`))
    console.log(notice(`join_private_page-socketId ${socket.id}`))
    socketService.addPrivateUser(userId, socket)
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
    if (!socketService.getPrivateRoomData(socket.id)) {
      console.log(notice(`[補] join_private_page: ${userId}`))
      console.log(notice(`join_private_page-socketId ${socket.id}`))
      socketService.addPrivateUser(userId, socket.id)
    }
    socketService.toggleSeenPrivateMsg(User1Id, User2Id)
    const roomId = await socketService.getRoomId(User1Id, User2Id)
    socketService.setPrivateRoomId(socket.id, roomId)
    console.log(detail(`set ${socket.id} new roomId to ${roomId}`))
    
    // 找到User2 的socketId
    // check isOnline or not
    const user2Sockets = socketService.checkUserOnline(User2Id)
    if (user2Sockets) {
      //join User1 into room
      socket.join(roomId)
      //join User2 into room
      console.log(detail(`user2的socket:`), isUserOnline)
      socketService.joinRoom(user2Sockets, roomId)
    }
    socketService.showSocketDetails()
    console.log(detail(`最後roomId結果: ${roomId} `))
    return roomId
  },
  leavePublicRoom: (userId, socket, io) => {
    socketService.showLeavePublicRoomNotice(userId)

    socketService.removeUserFromPublicRoom(socket.id)
    const user = socketService.getUserInfo(socket.id)
    io.emit('user_leave', {
      name: user.name
    })
    const users = socketService.getPublicRoomUsers()
    io.emit('online_users', {
      users
    })
  },
  leavePrivatePage: (socket) => {
    //去除privateRoomUsers內要離開的使用者
    if (socketService.getPrivateRoomData(socket.id)) {
      console.log(notice(`leave_private_page: `), socketService.getPrivateRoomData(socket.id))
      socketService.deletePrivateUser(socket.id)
    }
  },
  getPublicHistory: async (offset, limit) => {
    socketService.showGetPublicHistoryNotice()
    //roomId 1 is PublicRoom
    const publicRoomId = 1
    return socketService.getRoomHistory(publicRoomId)
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
    const message = await socketService.addMessage(userId, publicRoomId, content)
    const user = socketService.getUserInfo(socket.id)
    socket.broadcast.emit('get_public_msg', {
      content: message.content,
      createdAt: message.createdAt,
      avatar: user.avatar
    })
  },
  postPrivateMsg: async function (
    SenderId,
    ReceiverId,
    RoomId,
    content,
    socket
  ) {
    console.log(notice(`post_private_msg:`), {
      SenderId,
      ReceiverId,
      RoomId,
      content
    })
    if (!content) {
      return
    }
    const user = socketUsers[socket.id]
    const message = await socketService.addMessage(SenderId, RoomId, content)
    const isUserOnline = socketService.checkUserOnline(ReceiverId)
    const isReceiverOnPrivatePage = socketService.checkReceiverOnPrivatePage
    /* Receiver is in room */ //Receiver在聊天室裡
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
        createdAt
      })
    }
    /* Receiver is not in room */ //Receiver不在聊天室裡
    else {
      let record = await socketService.getMsgRecord(RoomId, SenderId)

      if (!record) {
        record = await socketService.getMsgRecord(RoomId, SenderId, ReceiverId)
      }
      /* Receiver is not on private page */
      if (!isReceiverOnPrivatePage) {
        record.isSeen = false
        /* Send Notice if Receiver is online */
        if (isUserOnline) {
          const getMsgNotice = await socketService.getMsgNotice(ReceiverId, null)
          isUserOnline.forEach((socketid) => {
            socket.to(socketid).emit('get_msg_notice', getMsgNotice)
          })
        }
      }
      record.increment({ unreadNum: 1 })
      record.save()
      const getMsgNoticeDetails = socketService.getMsgNoticeDetails(ReceiverId)
      if (isUserOnline) {
        isUserOnline.forEach((socketid) => {
          socket
            .to(socketid)
            .emit('get_msg_notice_details', getMsgNoticeDetails)
        })
      }
    }
  }
}

module.exports = socketController
