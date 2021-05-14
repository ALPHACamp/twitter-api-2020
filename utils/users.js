const db = require('../models')
const JoinRoom = db.JoinRoom
const User = db.User
const Notification = db.Notification

const PUBLIC_ROOM_ID = Number(process.env.PUBLIC_ROOM_ID)
const interactionType = {
  tweet: 1,
  follow: 2,
  reply: 3,
  like: 4
}
const users = []

const getCurrentUserInfo = async socket => {
  console.log('---- getCurrentUserInfo function ----')

  if (!socket.userId) return

  const user = await User.findByPk(socket.userId, {
    raw: true,
    nest: true,
    attributes: ['id', 'name', 'account', 'email', 'avatar', 'role']
  })

  if (!user) return

  socket.user = { ...user, socketId: socket.id }
}

const addUser = async ({ socketId, roomId, userId, username }) => {
  console.log('---- addUser function ----')
  console.log('socketId', socketId)
  console.log('roomId', roomId)
  console.log('userId', userId)
  console.log('username', username)

  const user = { socketId, roomId, userId, username }
  users.push(user)
  console.log('users', users)

  if (Number(user.roomId) === PUBLIC_ROOM_ID) {
    console.log(`Add user ${userId} to public room`)

    await JoinRoom.findOrCreate({
      where: { UserId: userId, ChatRoomId: roomId }
    })
  }
  return user
}

const getUsersInRoom = async roomId => {
  console.log('---- getUsersInRoom function ----')
  console.log('roomId', roomId)

  const usersId = new Set()
  users.map(user => {
    if (!usersId.has(user.userId) && user.roomId === roomId) {
      usersId.add(user.userId)
    }
  })

  console.log('usersId', usersId)

  const filteredUsers = await User.findAll({
    attributes: ['id', 'name', 'account', 'avatar'],
    raw: true,
    nest: true,
    where: { id: [...usersId] }
  })

  console.log('filteredUsers', filteredUsers)

  return filteredUsers
}

const removeUser = async socket => {
  console.log('---- removeUser function ----')
  console.log('socket.id', socket.id)

  const index = users.findIndex(
    user => user.socketId === socket.id && user.roomId === PUBLIC_ROOM_ID
  )
  console.log('index', index)

  if (index === -1) return null

  const user = users.splice(index, 1)[0]
  console.log('users', users)

  return user
}

const getAuthors = async userId => {
  console.log('---- getAuthors function ----')
  console.log('userId', userId)

  const user = await User.findByPk(userId, {
    include: [
      {
        model: User,
        as: 'Subscriptions'
      }
    ]
  })
  const subscriptions = user.dataValues.Subscriptions
  console.log(`${userId}'s subscriptions`, subscriptions)

  if (!subscriptions.length) return null
  return user.dataValues.Subscriptions.map(author => author.account)
}

const getOtherUser = async (userId, roomId) => {
  console.log('---- getOtherUser function ----')
  console.log('userId', userId)
  console.log('roomId', roomId)

  const user = await JoinRoom.findOne({
    where: { UserId: { $not: userId }, ChatRoomId: roomId }
  })
  return user.UserId
}

const updateTime = async (UserId, ChatRoomId) => {
  console.log('---- updateTime function ----')
  console.log('UserId', UserId)
  console.log('ChatRoomId', ChatRoomId)

  await JoinRoom.update({}, { where: { UserId, ChatRoomId } })

  console.log(`update time for user ${UserId} in room ${ChatRoomId}`)
}

const saveData = async data => {
  console.log('---- saveData function ----')
  console.log('data', data)

  if (
    data.type === interactionType.tweet ||
    data.type === interactionType.reply
  ) {
    return await Notification.findOrCreate({
      where: {
        UserId: data.id,
        receiverId: data.currentUserId,
        TweetId: data.tweetId ? data.tweetId : null,
        ReplyId: data.replyId ? data.replyId : null,
        type: data.type
      }
    })
  }

  const checkData = await Notification.findOne({
    where: {
      UserId: data.id,
      receiverId: data.currentUserId,
      type: data.type
    }
  })

  if (checkData) {
    console.log('checkData', checkData.toJSON())
    checkData.changed('updatedAt', true)
    return await checkData.save()
  }

  await Notification.create({
    UserId: data.id,
    receiverId: data.currentUserId,
    TweetId: data.tweetId ? data.tweetId : null,
    ReplyId: data.replyId ? data.replyId : null,
    type: data.type
  })
}

const getSubscribers = async userId => {
  console.log('---- getSubscribers function ----')
  console.log('userId', userId)

  const user = await User.findByPk(userId, {
    include: [{ model: User, as: 'Subscribers' }]
  })

  const subscribers = user.dataValues.Subscribers
  console.log('subscribers', subscribers)
  if (subscribers) {
    return subscribers.map(user => user.id)
  }
  return null
}

module.exports = {
  interactionType,
  PUBLIC_ROOM_ID,
  getCurrentUserInfo,
  addUser,
  getUsersInRoom,
  removeUser,
  users,
  getAuthors,
  getOtherUser,
  updateTime,
  saveData,
  getSubscribers
}
