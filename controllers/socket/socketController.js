const sockets = [] // array of sockets  找到對應的socket物件
const socketUsers = {} // key(userId) to value(socketId, name, account, avatar) 利用socketid可以找到對應使用者
const publicRoomUsers = [] // array of userIds 公開聊天室的socketId
const db = require('../../models')
const User = db.User
const Room = db.Room
const Message = db.Message
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
  isUser2Oneline: (User2Id) => {
    for (socketId in socketUsers) {
      if (socketUsers[socketId].id === User2Id) {
        return socketId
      }
    }
    return false
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
      avatar: currentUser.avatar,
      lastOnlineAt: currentUser.lastOnlineAt
    }
    console.log(`User is online: ${socketUsers[socket.id].name} / ${socket.id}`)
    socket.emit('message', `Your socket id is  ${socket.id}`)
  },
  putLastOnlineAt: (socket) => {
    // update lastOnlineA
    const timestamp = new Date()
    const userId = socketUsers[socket.id]
    User.findById(userId).then(user => {
      user.lastOnlineAt = timestamp
      user.save()
    })
  },
  deleteSocket: (socket, io) => {
    delete socketUsers[socket.id]
    if (publicRoomUsers.includes(socket.id)) {
      publicRoomUsers.splice(publicRoomUsers.indexOf(socket.id), 1)
      const users = showPublicRoomUser(publicRoomUsers)
      io.emit('online_users', {
        users
      })
    }
    const index = sockets.findIndex((obj) => obj.id === socket.id)
    sockets.splice(index, 1)
    console.log(`User is offline: ${socket.id}`)
  },
  getOfflineNotices: async (socket) => {
    const currentId = socket.request.user.id
    const lastOnlineAt = socketUsers[socket.id].lastOnlineAt
    const now = new Date()
    let Rooms = await Room.findAll({
      where: {
        '$or': [
          { User1Id: currentId },
          { User2Id: currentId }
        ]
      },
      include: {
        model: Message,
        as: 'Messages',
        where: {
          createdAt: {
            '$between': [lastOnlineAt, now]
          },
        },
        attributes: ['UserId']
      }
    })
    Rooms = Rooms.map(room => {
      const { id } = room.toJSON()
      const UserId = room.Messages[0].UserId
      return {
        RoomId: id,
        UserId
      }
    })
    return { Rooms }
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
  joinPrivateRoom: async (User1Id, User2Id) => {
    console.log('============================')
    console.log('join_private_room: ', { User1Id, User2Id })
    console.log('============================')
    const options = {
      where: {
        [Op.or]: [
          { User1Id, User2Id },
          { User1Id: User2Id, User2Id: User1Id }
        ]
      }
    }
    const room = await Room.findOne(options)
    let roomId
    if (room) {
      roomId = room.id
    } else {
      roomId = await Room.create({ User1Id, User2Id })
      roomId = roomId.toJSON().id
    }
    // 找到User2 的socketId
    // check isOnline or not
    const isUser2Oneline = isUser2Oneline(User2Id)
    if (isUser2Oneline) {
      //join User1 into room
      socket.join(roomId)
      //join User2 into room
      sockets[isUser2Oneline].join(roomId)
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
  postPrivateMsg: async (UserId, RoomId, content, socket) => {
    console.log('============================')
    console.log('post_private_msg: ', { UserId, RoomId, content })
    console.log('============================')
    if (content.length === 0 || !content) {
      return
    }
    const user = socketUsers[socket.id]
    const message = await Message.create({ UserId, RoomId, content })
    let createdAt = message.createdAt
    const avatar = user.avatar
    socket
      .to(RoomId)
      .emit('get_private_msg', { UserId, RoomId, content, avatar, createdAt })
  }
}

module.exports = socketController