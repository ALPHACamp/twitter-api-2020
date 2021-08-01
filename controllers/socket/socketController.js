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

let helper = {
  getPublicRoomUsers: () => {
    let users = []
    publicRoomUsers.forEach((socketId) => {
      if (socketUsers[socketId]) {
        users.push(socketUsers[socketId])
      }
    })
    let allId = users.map((item) => item.id)
    users = users.filter((user, i, arr) => allId.indexOf(user.id) === i)
    return users
  },
  isUser2Online: (User2Id) => {
    const users = []
    for (socketId in socketUsers) {
      if (socketUsers[socketId].id === User2Id) {
        users.push(socketId)
      }
    }
    if (users.length) {
      return users
    }
    return false
  },
  isReceiverOnPrivatePage: (ReceiverId) => {
    const receiverRooms = []
    for (socketId in privateRoomUsers) {
      if (privateRoomUsers[socketId].id === ReceiverId) {
        receiverRooms.push(privateRoomUsers[socketId].currentRoom)
      }
    }
    if (receiverRooms.length) {
      return receiverRooms
    }
    return false
  },
  getMsgNotice: async (userId) => {
    const { count } = await MessageRecord.findAndCountAll({
      where: {
        ReceiverId: userId,
        isSeen: false
      }
    })
    return count
  },
  getMsgNoticeDetails: async (userId) => {
    const notices = await MessageRecord.findAll({
      attributes: ['SenderId', 'RoomId', 'unreadNum', 'isSeen'],
      where: {
        ReceiverId: userId,
        unreadNum: { [Op.not]: 0 }
      }
    })
    const unseenRooms = notices
      .filter((notice) => notice.isSeen === false)
      .map((notice) => {
        return {
          SenderId: notice.SenderId
        }
      })
    const unreadRooms = notices.map((notice) => {
      return {
        SenderId: notice.SenderId,
        unreadNum: notice.unreadNum
      }
    })
    return { unseenRooms, unreadRooms }
  }
}

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
    console.log(`User is online: ${socketUsers[socket.id].name} / ${socket.id}`)
    socket.emit('message', `Your socket id is  ${socket.id}`)
  },
  deleteSocket: (socket, io) => {
    delete socketUsers[socket.id]
    if (publicRoomUsers.includes(socket.id)) {
      publicRoomUsers.splice(publicRoomUsers.indexOf(socket.id), 1)
      const users = helper.getPublicRoomUsers()
      io.emit('online_users', {
        users
      })
    }
    const index = sockets.findIndex((obj) => obj.id === socket.id)
    sockets.splice(index, 1)
    console.log(`User is offline: ${socket.id}`)
  },
  joinPublicRoom: (userId, socket, io) => {
    console.log('============================')
    console.log('join_public_room: ', userId)
    console.log('加入公開的socket ID: ', socket.id)
    console.log('============================')

    publicRoomUsers.push(socket.id)
    const user = socketUsers[socket.id]
    io.emit('new_join', {
      name: user.name
    })
    const users = helper.getPublicRoomUsers()
    io.emit('online_users', {
      users
    })
  },
  leavePublicRoom: (userId, socket, io) => {
    console.log('============================')
    console.log('leave_public_room: ', userId)
    console.log('============================')

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
  joinPrivateRoom: async (User1Id, User2Id, socket) => {
    console.log('============================')
    console.log('join_private_room: ', { User1Id, User2Id })
    console.log('============================')
    const roomOptions = {
      where: {
        [Op.or]: [
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
      record.update({ unreadNum: 0 })
    }
    const room = await Room.findOne(roomOptions)
    let roomId
    if (room) {
      roomId = room.id
    } else {
      roomId = await Room.create({ User1Id, User2Id })
      roomId = roomId.toJSON().id
    }
    privateRoomUsers[socket.id].currentRoom = roomId
    // 找到User2 的socketId
    // check isOnline or not
    const isUser2Online = helper.isUser2Online(User2Id)
    if (isUser2Online) {
      //join User1 into room
      socket.join(roomId)
      //join User2 into room
      isUser2Online.forEach((socketId) => {
        const targetSocket = sockets.find((element) => element.id === socketId)
        targetSocket.join(roomId)
      })
    }
    return roomId
  },
  getPublicHistory: async (offset, limit) => {
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
  postPublicMsg: async (content, userId, socket) => {
    console.log('============================')
    console.log('post_public_msg: ', { content, userId })
    console.log('============================')
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
  postPrivateMsg: async (SenderId, ReceiverId, RoomId, content, socket) => {
    console.log('============================')
    console.log('post_private_msg: ', { SenderId, ReceiverId, RoomId, content })
    console.log('============================')
    if (!content) {
      return
    }
    const user = socketUsers[socket.id]
    const message = await Message.create({ UserId: SenderId, RoomId, content })
    const isUser2Online = helper.isUser2Online(ReceiverId)
    const isReceiverOnPrivatePage = helper.isReceiverOnPrivatePage(ReceiverId)
    /* Receiver is in room */ //Receiver在聊天室裡
    if (isReceiverOnPrivatePage.includes(message.RoomId)) {
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
        /* Receiver is online */
        if (isUser2Online) {
          const getMsgNotice = helper.getMsgNotice(ReceiverId)
          isUser2Online.forEach((socketid) => {
            socket.to(socketid).emit('get_msg_notice', getMsgNotice)
          })
        }
      }
      record.increment({ unreadNum: 1 })
      record.save()
      const getMsgNoticeDetails = helper.getMsgNoticeDetails(ReceiverId)
      if (isUser2Online) {
        isUser2Online.forEach((socketid) => {
          socket
            .to(socketid)
            .emit('get_msg_notice_details', getMsgNoticeDetails)
        })
      }
    }
  },
  joinPrivatePage: async (userId, socket) => {
    console.log('============================')
    console.log('join_private_page: ', userId)
    console.log('join_private_page-socketId ', socket.id)
    console.log('============================')
    const userInfo = {
      id: userId,
      currentRoom: null
    }
    //加入privateRoomUsers
    privateRoomUsers[socket.id] = userInfo
    //更新isSeen為true
    const MsgRecordOption = {
      where: {
        ReceiverId: +userId,
        isSeen: false
      },
      attributes: ['id']
    }
    await MessageRecord.findAll(MsgRecordOption).then((records) => {
      records = records.map(record => record.id)
      MessageRecord.update({ isSeen: true }, { where: { id: records } })
    })
    //拿取使用者加入的rooms並傳送
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
              attributes: ['id', 'avatar', 'name', 'account']
            }
          ]
        }
      ],
      attributes: {
        include: [
          [
            sequelize.literal(
              '(select createdAt from Messages where Messages.RoomId = Room.id LIMIT 1)'
            ),
            'lastMsgTime'
          ]
        ],
        exclude: ['updatedAt', 'User1Id', 'User2Id', 'createdAt']
      },
      order: [[sequelize.literal('lastMsgTime'), 'desc']],
      limit: 5
    }
    const rooms = await Room.findAll(roomOption).then((rooms) => {
      rooms.forEach((room) => {
        const user = room.dataValues.Messages[0].dataValues.User
        room.dataValues.Message = room.dataValues.Messages[0].dataValues.content
        room.dataValues.User = user
        delete room.dataValues.Messages
      })
      return rooms
    })
    socket.emit('get_private_rooms', rooms)
    const getMsgNoticeDetails = await helper.getMsgNoticeDetails(userId)
    socket.emit('get_msg_notice_details', getMsgNoticeDetails)
  },
  leavePrivatePage: (socket) => {
    console.log('離開私人page:',socket.id)
    console.log(' privateRoomUsers[socket.id]:', privateRoomUsers)
    console.log('============================')
    console.log('leave_private_page: ', privateRoomUsers[socket.id].id)
    console.log('============================')
    //去除privateRoomUsers內要離開的使用者
    if (privateRoomUsers[socket.id]) {
      delete privateRoomUsers[socket.id]
    }
  }
}

module.exports = socketController
