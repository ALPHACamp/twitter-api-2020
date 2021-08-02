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