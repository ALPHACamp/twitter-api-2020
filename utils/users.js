const db = require('../models')
const JoinRoom = db.JoinRoom

const users = []

const addUser = async ({ socketId, roomId, userId, username }) => {
  // console.log('users', users)
  // 不該存入重複的 user & room 的組合，要加 socketId 嗎？
  await JoinRoom.create({ UserId: userId, ChatRoomId: roomId })
  const user = { socketId, roomId, userId, username }
  users.push(user)
  return user
}

const getUser = socketId => {
  return users.find(user => user.socketId === socketId)
}

const countUsers = roomId => {
  const usersId = {}
  const filteredUsers = users.filter(user => {
    if (!usersId[user.userId]) {
      usersId[user.userId] = 1
    }
    return usersId[user.userId] && user.roomId === roomId
  })
  return filteredUsers.length
}

const removeUser = async socketId => {
  const index = users.findIndex(user => user.socketId === socketId)
  if (index !== -1) {
    const user = users.splice(index, 1)[0]
    await JoinRoom.destroy({
      where: { UserId: user.userId, ChatRoomId: user.roomId }
    })
    return user
  }
}

module.exports = { addUser, getUser, countUsers, removeUser }
