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
    console.log(highlight(` User is online: ${socketUsers[socket.id].name} / ${socket.id}`))
    socket.emit('message', `Your socket id is  ${socket.id}`)
  },
  deleteSocket: (socket, io) => {
    if (privateRoomUsers[socket.id]) {
      delete privateRoomUsers[socket.id]
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
  getMsgNotice: async (userId, socket) => {
    if (socket) {
      userId = socketUsers[socket.id].id
    }
    const { count } = await MessageRecord.findAndCountAll({
      where: {
        ReceiverId: userId,
        isSeen: false
      }
    })
    return count
  },
  joinPublicRoom: async (userId, socket, io) => {
    console.log(notice(`join_public_room: ${userId}`))
    console.log(notice(`加入公開的socket ID: ${socket.id}`))

    publicRoomUsers.push(socket.id)

    console.log(detail('all sockets [伺服器紀錄]'), '\n', sockets.map(item => item.id))
    const ids = await io.allSockets()
    console.log(detail('all sockets [系統偵測]'), '\n', Array.from(ids))
    console.log(detail('all socketUsers [詳細資料]'), '\n', socketUsers)
    console.log(detail('all publicRoomUsers '), '\n', publicRoomUsers)
    console.log(detail('all privateRoomUsers '), '\n', privateRoomUsers)

    const user = socketUsers[socket.id]
    io.emit('new_join', {
      name: user.name
    })
    const users = helper.getPublicRoomUsers()
    io.emit('online_users', {
      users
    })
  },
  joinPrivatePage: async function (userId, socket) {
    console.log(notice(`join_private_page: ${userId}`))
    console.log(notice(`join_private_page-socketId ${socket.id}`))
    const userInfo = {
      id: userId,
      currentRoom: null
    }
    //加入privateRoomUsers
    privateRoomUsers[socket.id] = userInfo
    //更新isSeen為true
    const MsgRecordOption = {
      where: {
        ReceiverId: userId,
        isSeen: false
      },
      attributes: ['id']
    }
    await MessageRecord.findAll(MsgRecordOption).then((records) => {
      records = records.map(record => record.id)
      MessageRecord.update({ isSeen: true }, { where: { id: records } })
    })
    //emit get_private_rooms
    const rooms = await this.getPrivateRooms
    socket.emit('get_private_rooms', rooms)
    const getMsgNoticeDetails = await helper.getMsgNoticeDetails(userId)
    socket.emit('get_msg_notice_details', getMsgNoticeDetails)
  },
  joinPrivateRoom: async (User1Id, User2Id, socket, io) => {
    console.log(notice(`join_private_room:`), { User1Id, User2Id })
    /* if miss join_private_page */
    if (!privateRoomUsers[socket.id]) {
      console.log(notice(`[補] join_private_page: ${userId}`))
      console.log(notice(`join_private_page-socketId ${socket.id}`))
      const userInfo = {
        id: userId,
        currentRoom: null
      }
      //加入privateRoomUsers
      privateRoomUsers[socket.id] = userInfo
    }
    const roomOptions = {
      where: {
        $or: [
          { User1Id, User2Id },
          { User1Id: User2Id, User2Id: User1Id }
        ]
      }
    }
    const recordOptions = {
      where: {
        ReceiverId: User1Id,
        SenderId: User2Id
      }
    }
    const record = await MessageRecord.findOne(recordOptions)
    if (record) {
      await record.update({ unreadNum: 0 })
    }
    let roomId
    const room = await Room.findOne(roomOptions)

    if (room) {
      console.log(detail("room已存在，roomId為:"), room.id)
      roomId = room.id
    } else {
      roomId = await Room.create({ User1Id, User2Id })
      console.log(detail("建立新的room，roomId為:"), room.toJSON())
      roomId = roomId.toJSON().id
    }
    console.log(detail(`set new roomId to ${socket.id}`))
    privateRoomUsers[socket.id].currentRoom = roomId
    // 找到User2 的socketId
    // check isOnline or not
    const isUserOnline = helper.isUserOnline(User2Id)
    if (isUserOnline) {
      //join User1 into room
      socket.join(roomId)
      //join User2 into room
      console.log(detail(`user2的socket:`), isUserOnline)
      isUserOnline.forEach((socketId) => {
        const targetSocket = sockets.find((element) => element.id === socketId)
        console.log(targetSocket.id)
        targetSocket.join(roomId)
      })
    }
    console.log(detail('all sockets [伺服器紀錄]'), '\n', sockets.map(item => item.id))
    const ids = await io.allSockets()
    console.log(detail('all sockets [系統偵測]'), '\n', Array.from(ids))
    console.log(detail('all socketUsers [詳細資料]'), '\n', socketUsers)
    console.log(detail('all publicRoomUsers '), '\n', publicRoomUsers)
    console.log(detail('all privateRoomUsers '), '\n', privateRoomUsers)
    console.log(detail(`最後roomId結果: ${roomId} `))
    return roomId
  },
  leavePublicRoom: (userId, socket, io) => {
    console.log(notice('leave_public_room: '), userId)

    publicRoomUsers.splice(publicRoomUsers.indexOf(socket.id), 1)
    const user = socketUsers[socket.id]
    io.emit('user_leave', {
      name: user.name
    })
    const users = helper.getPublicRoomUsers()
    io.emit('online_users', {
      users
    })
  },
  leavePrivatePage: (socket) => {
    //去除privateRoomUsers內要離開的使用者
    if (privateRoomUsers[socket.id]) {
      console.log(notice(`leave_private_page: `), privateRoomUsers[socket.id])
      delete privateRoomUsers[socket.id]
    }
  },
  getPublicHistory: async (offset, limit) => {

    console.log(notice(`get_public_history: roomId ${1}`))
    const options = {
      offset,
      limit,
      order: [['createdAt', 'desc']],
      include: [
        {
          model: User,
          attributes: ['avatar'],
          as: 'User'
        }
      ],
      where: {
        RoomId: 1
      }
    }
    const messages = await Message.findAll(options)
    messages.forEach((message) => {
      message.dataValues.avatar = message.dataValues.User.avatar
      delete message.dataValues.User
    })
    return messages
  },
  getPrivateHistory: async (offset, limit, RoomId) => {
    console.log(notice(`get_private_history:`), { offset, limit, RoomId })
    const options = {
      offset,
      limit,
      order: [['createdAt', 'desc']],
      include: [
        {
          model: User,
          attributes: ['avatar'],
          as: 'User'
        }
      ],
      where: {
        RoomId
      }
    }
    const messages = await Message.findAll(options)
    messages.forEach((message) => {
      message.dataValues.avatar = message.dataValues.User.avatar
      delete message.dataValues.User
    })
    return messages
  },
  getPrivateRooms: async (userId) => {
    const roomOption = {
      where: {
        [Op.or]: [{ User1Id: userId }, { User2Id: userId }],
        [Op.and]: [
          sequelize.literal(
            'EXISTS (select createdAt from Messages where Messages.RoomId = Room.id LIMIT 1)'
          )
        ]
      },
      include: [
        {
          model: Message,
          as: 'Messages',
          limit: 1,
          include: [
            {
              model: User,
              as: 'User',
              attributes: ['id'],
            },
          ],
          order: [['createdAt', 'desc']]
        },
        {
          model: User,
          as: 'User1',
          attributes: ['id', 'name', 'account', 'avatar']
        },
        {
          model: User,
          as: 'User2',
          attributes: ['id', 'name', 'account', 'avatar']
        }
      ],
      attributes: {
        exclude: ['updatedAt', 'User1Id', 'User2Id', 'createdAt']
      },
      order: [[sequelize.literal(
        '(select createdAt from Messages where Messages.RoomId = Room.id order by Messages.createdAt DESC LIMIT 1)'
      ), 'DESC']],
      limit: 5
    }
    const rooms = await Room.findAll(roomOption)
      .then((rooms) => {
        rooms.forEach((room) => {
          const user = room.dataValues.User1.dataValues.id !== userId ? room.dataValues.User1.dataValues : room.dataValues.User2.dataValues
          room.dataValues.lastMsg = {}
          room.dataValues.lastMsg.fromRoomMember = room.dataValues.Messages[0].dataValues.User.id !== userId
          room.dataValues.lastMsg.content = room.dataValues.Messages[0].dataValues.content
          room.dataValues.lastMsg.createdAt = room.dataValues.Messages[0].dataValues.createdAt
          room.dataValues.roomMember = user
          delete room.dataValues.Messages
          delete room.dataValues.User1
          delete room.dataValues.User2
          return room.dataValues
        })
        return rooms
      })
    return rooms
  },
  postPublicMsg: async (content, userId, socket) => {
    console.log(notice(`post_public_msg:`, { content, userId }))
    if (!content) {
      return
    }
    const message = await Message.create({
      RoomId: 1,
      UserId: userId,
      content
    })
    const user = socketUsers[socket.id]
    socket.broadcast.emit('get_public_msg', {
      content: message.content,
      createdAt: message.createdAt,
      avatar: user.avatar
    })
  },
  postPrivateMsg: async function (SenderId, ReceiverId, RoomId, content, socket) {
    console.log(notice(`post_private_msg:`), { SenderId, ReceiverId, RoomId, content })
    if (!content) {
      return
    }
    const user = socketUsers[socket.id]
    const message = await Message.create({ UserId: SenderId, RoomId, content })
    const isUserOnline = helper.isUserOnline(ReceiverId)
    const isReceiverOnPrivatePage = helper.isReceiverOnPrivatePage(ReceiverId)
    /* Receiver is in room */ //Receiver在聊天室裡
    if (isReceiverOnPrivatePage && isReceiverOnPrivatePage.includes(message.RoomId)) {
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
      let record = await MessageRecord.findOne({
        where: {
          RoomId: RoomId,
          SenderId: SenderId
        }
      })

      if (!record) {
        record = await MessageRecord.create({
          SenderId: SenderId,
          ReceiverId: ReceiverId,
          RoomId: RoomId,
          isSeen: true,
          unreadNum: 0
        })
      }
      /* Receiver is not on private page */
      if (!isReceiverOnPrivatePage) {
        record.isSeen = false
        /* Send Notice if Receiver is online */
        if (isUserOnline) {
          const getMsgNotice = await this.getMsgNotice(ReceiverId, null)
          isUserOnline.forEach((socketid) => {
            socket.to(socketid).emit('get_msg_notice', getMsgNotice)
          })
        }
      }
      record.increment({ unreadNum: 1 })
      record.save()
      const getMsgNoticeDetails = helper.getMsgNoticeDetails(ReceiverId)
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
