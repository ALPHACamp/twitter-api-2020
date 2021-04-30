const db = require('../models')
const JoinRoom = db.JoinRoom
const User = db.User

const PublicRoomId = 4
const users = []

const addUser = async ({ socketId, roomId, userId, username }) => {
  const user = { socketId, roomId, userId, username }
  users.push(user)
  if (Number(user.roomId) === PublicRoomId) {
    // 不該存入重複的 user & room 的組合，要加 socketId 嗎？
    await JoinRoom.create({ UserId: userId, ChatRoomId: roomId })
  }
  return user
}

const getUser = async socketId => {
  const user = users.find(user => user.socketId === socketId)
  const userInfo = await User.findByPk(user.userId)
  return { ...user, avatar: userInfo.avatar }
}

const getUserInfo = async userId => {
  const user = User.findByPk(userId)
  if (!user) return null
  return {
    id: user.id,
    account: user.account,
    name: user.name,
    avatar: user.avatar
  }
}

const getUsersInRoom = async roomId => {
  const usersId = new Set()
  users.map(user => {
    if (!usersId.has(user.userId) && user.roomId === roomId) {
      usersId.add(user.userId)
    }
  })
  const filteredUsers = await User.findAll({
    attributes: ['id', 'name', 'account', 'avatar'],
    raw: true,
    nest: true,
    where: { id: [...usersId] }
  })
  return filteredUsers
}

const removeUser = async socketId => {
  const index = users.findIndex(user => user.socketId === socketId)
  if (index !== -1) {
    const user = users.splice(index, 1)[0]

    // Don't delete private room's record
    if (Number(user.roomId) === PublicRoomId) {
      await JoinRoom.destroy({
        where: { UserId: user.userId, ChatRoomId: user.roomId }
      })
    }

    return user
  }
}

const getAuthors = async userId => {
  const user = await User.findByPk(userId, {
    include: [
      {
        model: User,
        as: 'Subscriptions'
      }
    ]
  })
  const subscriptions = user.dataValues.Subscriptions
  if (!subscriptions.length) return null
  return user.dataValues.Subscriptions.map(author => author.account)
}

module.exports = {
  addUser,
  getUser,
  getUsersInRoom,
  removeUser,
  users,
  getAuthors,
  getUserInfo
}
