const sockets = [] // array of sockets  找到對應的socket物件
const socketUsers = {} // key(socketid) to value(id, name, account, avatar) 利用socketid可以找到對應使用者
const publicRoomUsers = [] // array of userIds 公開聊天室的socketId
let privateRoomUsers = {} // key(socketid) to value(id, currentRoom)
const db = require('../models')
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

let socketService = {
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
  checkUserOnline: (UserId) => {
    const users = []
    for (socketId in socketUsers) {
      if (socketUsers[socketId].id === UserId) {
        users.push(socketId)
      }
    }
    if (users.length) {
      return users
    }
    return false
  },
  checkReceiverOnPrivatePage: (ReceiverId) => {
    const receiverRooms = []
    for (socketId in privateRoomUsers) {
      if (privateRoomUsers[socketId].id === ReceiverId) {
        receiverRooms.push(privateRoomUsers[socketId].currentRoom)
      }
    }
    if (receiverRooms.length) {
      console.log(detail('receiverRooms:'), receiverRooms)
      return receiverRooms
    }
    return false
  },
  addPrivateUser: (userId, socket) => {
    const userInfo = {
      id: userId,
      currentRoom: null
    }
    //加入privateRoomUsers
    privateRoomUsers[socket.id] = userInfo
  },
  deletePrivateUser: (socketId) => {
    delete privateRoomUsers[socketId]
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
  toggleSeenMsgRecord: async (userId) => {
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
  },
  getPrivateRoomData: async (socketId) => {
    return privateRoomUsers[socketId]
  },
  toggleSeenPrivateMsg: async (User1Id, User2Id) => {
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
    return
  },
  getRoomId: async (User1Id, User2Id) => {
    const roomOptions = {
      where: {
        $or: [
          { User1Id, User2Id },
          { User1Id: User2Id, User2Id: User1Id }
        ]
      }
    }
    const room = await Room.findOne(roomOptions)
    let roomId
    if (room) {
      console.log(detail("room已存在，roomId為:"), room.id)
      roomId = room.id
    } else {
      roomId = await Room.create({ User1Id, User2Id })
      console.log(detail("建立新的room，roomId為:"), room.toJSON())
      roomId = roomId.toJSON().id
    }
    return roomId
  },
  joinRoom: (userSocketIds, roomId) => {
    userSocketIds.forEach((socketId) => {
      const targetSocket = sockets.find((element) => element.id === socketId)
      console.log(targetSocket.id)
      targetSocket.join(roomId)
    })
  },
  setPrivateRoomId: (socketId, roomId) => {
    privateRoomUsers[socketId].currentRoom = roomId
    return
  },
  showSocketDetails: () => {
    console.log(detail('all sockets [伺服器紀錄]'), '\n', sockets.map(item => item.id))
    const ids = await io.allSockets()
    console.log(detail('all sockets [系統偵測]'), '\n', Array.from(ids))
    console.log(detail('all socketUsers [詳細資料]'), '\n', socketUsers)
    console.log(detail('all publicRoomUsers '), '\n', publicRoomUsers)
    console.log(detail('all privateRoomUsers '), '\n', privateRoomUsers)
  },
  getRoomHistory: async (offset, limit, RoomId) => {
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
  addMessage: async (UserId, RoomId, content) => {
    const message = await Message.create({ UserId, RoomId, content })
    return message
  },
  getMsgRecord: async (RoomId, SenderId) => {
    const record = await MessageRecord.findOne({
      where: {
        RoomId: RoomId,
        SenderId: SenderId
      }
    })
    return record
  },
  createMsgRecord: async (RoomId, SenderId, ReceiverId) => {
    const record = await MessageRecord.create({
      SenderId: SenderId,
      ReceiverId: ReceiverId,
      RoomId: RoomId,
      isSeen: true,
      unreadNum: 0
    })
    return record
  },
  updateMsgRecord: async () => {

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

module.exports = socketService