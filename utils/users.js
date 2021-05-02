const db = require('../models')
const JoinRoom = db.JoinRoom
const User = db.User
const Notification = db.Notification

const PublicRoomId = 4
const users = []

const addUser = async ({ socketId, roomId, userId, username }) => {
  const user = { socketId, roomId, userId, username }
  users.push(user)
  if (Number(user.roomId) === PublicRoomId) {
    await JoinRoom.findOrCreate({
      where: { UserId: userId, ChatRoomId: roomId }
    })
  }
  return user
}

const getUser = async socketId => {
  const user = users.find(user => user.socketId === socketId)
  const userInfo = await User.findByPk(user.userId)
  return { ...user, avatar: userInfo.avatar }
}

const getUserInfo = async userId => {
  let user = await User.findByPk(userId)
  user = user.toJSON()
  console.log('user - getUserInfo', user)
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

const getOtherUser = async (userId, roomId) => {
  console.log('userId+roomId', userId, roomId)
  const user = await JoinRoom.findOne({
    where: { UserId: { $not: userId }, ChatRoomId: roomId }
  })
  return user.UserId
}

const updateTime = async (UserId, ChatRoomId) => {
  await JoinRoom.update(
    { updateAt: Date.now() },
    { where: { UserId, ChatRoomId } }
  )
}

const saveData = async data => {
  await Notification.create({
    UserId: data.id,
    otherUserId: data.currentUserId,
    TweetId: data.tweetId ? data.tweetId : null,
    ReplyId: data.replyId ? data.replyId : null,
    type: data.type
  })
}

module.exports = {
  addUser,
  getUser,
  getUsersInRoom,
  removeUser,
  users,
  getAuthors,
  getUserInfo,
  getOtherUser,
  updateTime,
  saveData
}
