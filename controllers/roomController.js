const { Op } = require('sequelize')
const db = require('../models')
const User = db.User
const Room = db.Room

const roomController = {
  getConnectedUsers: (req, res) => {
    const currentUserId = req.user.id

    // 找出 currentUser 在其中的所有聊天室
    Room.findAll({
      where: {
        [Op.or]: [
          { User1Id: currentUserId },
          { User2Id: currentUserId }
        ]
      }
    })
      .then(rooms => {
        // 將 rooms 轉成純陣列(去除資料庫的一些屬性)
        rooms = { rooms: rooms }
        rooms = JSON.stringify(rooms)
        rooms = JSON.parse(rooms)
        rooms = rooms.rooms.map(room => ({
          ...room,
        }))

        // 透過 rooms，找出聊天對象 user 的資訊，找出使用者們的資訊，再回傳給前端
        Promise.all(Array.from(rooms).map(room => {
          // 如果 room.User1Id !== currentUserId，代表 room.User1Id 就是聊天對象 user 的id
          if (room.User1Id !== currentUserId) {
            return User.findByPk(room.User1Id)
              .then(user => {
                user = {
                  id: user.id,
                  name: user.name,
                  avatar: user.avatar,
                  account: user.account,
                  socketId: user.socketId,
                  currentUserUnread: room.User2Unread,
                  currentUserUnreadNum: room.User2UnreadNum
                }
                return user
              })
          } else if (room.User2Id !== currentUserId) {
            return User.findByPk(room.User2Id)
              .then(user => {
                user = {
                  id: user.id,
                  name: user.name,
                  avatar: user.avatar,
                  account: user.account,
                  socketId: user.socketId,
                  currentUserUnread: room.User1Unread,
                  currentUserUnreadNum: room.User1UnreadNum
                }
                return user
              })
          }
        }))
          .then(users => {
            return res.json(users)
          })
      })
  },
  createChatRoom: (req, res) => {
    // 透過前端傳來的 2 位使用者的 id，找出對應的 room
    let user1Id = 0
    let user2Id = 0
    if (req.user.id > req.body.targetUserId) {
      user1Id = req.body.targetUserId
      user2Id = req.user.id
    } else {
      user1Id = req.user.id
      user2Id = req.body.targetUserId
    }

    Room.findOne({ where: { User1Id: user1Id, User2Id: user2Id } })
      .then(room => {
        if (room) {
          User.findByPk(req.body.targetUserId)
            .then(user => {
              user = {
                id: user.id,
                name: user.name,
                account: user.account,
                avatar: user.avatar
              }
              return res.json({ RoomId: room.id, targetUser: user })
            })
        } else {
          Room.create({
            User1Id: user1Id,
            User2Id: user2Id
          })
            .then(room => {

              User.findByPk(req.body.targetUserId)
                .then(user => {
                  user = {
                    id: user.id,
                    name: user.name,
                    account: user.account,
                    avatar: user.avatar
                  }
                  return res.json({ RoomId: room.id, targetUser: user })
                })
            })
        }
      })
  }
}

module.exports = roomController
