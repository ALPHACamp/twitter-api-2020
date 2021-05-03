const db = require('../models')
const JoinRoom = db.JoinRoom
const User = db.User
const Notification = db.Notification

const PublicRoomId = 4
const users = []

const addUser = async ({ socketId, roomId, userId, username }) => {
  console.log('---- addUser function ----')
  console.log('socketId', socketId)
  console.log('roomId', roomId)
  console.log('userId', userId)
  console.log('username', username)

  const user = { socketId, roomId, userId, username }
  users.push(user)
  if (Number(user.roomId) === PublicRoomId) {
    console.log(`Add user ${userId} to public room`)

    await JoinRoom.findOrCreate({
      where: { UserId: userId, ChatRoomId: roomId }
    })
  }
  return user
}

const getUser = async (socketId, userId) => {
  console.log('---- getUser function ----')
  console.log('socketId', socketId)

  if (userId) {
    console.log('userId', userId)

    const userInfo = await User.findByPk(userId)

    console.log('userInfo', userInfo)

    return {
      id: userInfo.id,
      account: userInfo.account,
      name: userInfo.name,
      avatar: userInfo.avatar
    }
  }

  const user = users.find(user => user.socketId === socketId)
  const userInfo = await User.findByPk(user.userId)
  return { ...user, avatar: userInfo.avatar }
}

const getUserInfo = async userId => {
  console.log('---- getUserInfo function ----')
  console.log('userId', userId)

  let user = await User.findByPk(userId)
  if (!user) return null

  user = user.toJSON()
  return {
    id: user.id,
    account: user.account,
    name: user.name,
    avatar: user.avatar
  }
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

const removeUser = async (socketId, roomId, userId) => {
  console.log('---- getOtherUser function ----')
  console.log('socketId', socketId)

  const originalRoomId = roomId ? roomId : PublicRoomId
  console.log('originalRoomId', originalRoomId)

  const index = users.findIndex(
    user => user.socketId === socketId && user.roomId === originalRoomId
  )
  console.log('index', index)

  if (index === -1) return null

  const user = users.splice(index, 1)[0]
  console.log('user', user)

  userId = userId || user.userId

  console.log(`update time for user ${userId} in room ${originalRoomId}`)
  await updateTime(userId, originalRoomId)

  // private room
  if (roomId) return null

  // public room
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

  await JoinRoom.update(
    { updatedAt: Date.now() },
    { where: { UserId, ChatRoomId } }
  )

  console.log(`update time for user ${UserId} in room ${ChatRoomId}`)
}

const saveData = async data => {
  console.log('---- saveData function ----')
  console.log('data', data)

  if (data.type === 1 || data.type === 3) {
    return await Notification.findOrCreate({
      where: {
        UserId: data.id,
        otherUserId: data.currentUserId,
        TweetId: data.tweetId ? data.tweetId : null,
        ReplyId: data.replyId ? data.replyId : null,
        type: data.type
      }
    })
  }

  const checkData = await Notification.findOne({
    where: {
      UserId: data.id,
      otherUserId: data.currentUserId,
      type: data.type
    }
  })

  if (checkData) {
    console.log('checkData', checkData.toJSON())
    checkData.changed('updatedAt', true)
    return await checkData.save()
    // return await checkData.update({ updatedAt: Date.now() })
  }

  await Notification.create({
    UserId: data.id,
    otherUserId: data.currentUserId,
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
  addUser,
  getUser,
  getUsersInRoom,
  removeUser,
  users,
  getAuthors,
  getUserInfo,
  getOtherUser,
  updateTime,
  saveData,
  getSubscribers
}
