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

// For Controllers
function getFollowshipInfo(user, followships, currentUserFollowings) {
  const idName = followships === 'Followers' ? 'followerId' : 'followingId'

  return user.dataValues[followships].map(followship => {
    if (followship.role === 'admin') {
      return null
    }
    return {
      [idName]: followship.id,
      name: followship.name,
      account: followship.account,
      avatar: followship.avatar,
      introduction: followship.introduction,
      createdAt: followship.Followship.createdAt,
      isFollowing: currentUserFollowings.includes(followship.id)
    }
  })
}

function getResourceInfo(user, resource, likes) {
  return user.dataValues[resource].map(el => {
    const tweet = el.Tweet
    if (!tweet) {
      return null
    }
    return {
      id: el.id,
      comment: el.comment,
      createdAt: el.createdAt,
      TweetId: el.TweetId,
      Tweet: {
        id: tweet.id,
        description: tweet.description,
        createdAt: tweet.createdAt,
        isLiked: likes.includes(tweet.id),
        User: {
          id: tweet.User.id,
          name: tweet.User.name,
          account: tweet.User.account,
          avatar: tweet.User.avatar
        },
        replyCount: tweet.Replies.length,
        likeCount: tweet.Likes.length
      }
    }
  })
}

async function checkUserInfo(req) {
  const errors = []
  const { account, name, email, password, checkPassword } = req.body
  const emailRule = /^\w+((-\w+)|(\.\w+)|(\+\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/

  // Before creating an account or updating account info ,
  // make sure all the required fields are correctly filled out
  if (!account || !name || !email || !password || !checkPassword) {
    errors.push({ message: 'Please fill out all fields.' })
  }
  if (email.search(emailRule) === -1) {
    errors.push({ message: 'Please enter the correct email address.' })
  }
  if (password.length < 4 || password.length > 12) {
    errors.push({ message: 'Password does not meet the required length' })
  }
  if (password !== checkPassword) {
    errors.push({ message: 'Password and checkPassword do not match.' })
  }
  if (name.length > 50) {
    errors.push({ message: 'Name can not be longer than 50 characters.' })
  }
  if (account.length > 50) {
    errors.push({
      message: 'Account can not be longer than 50 characters.'
    })
  }

  if (errors.length > 0) return { errors }

  // email amd account should be unique
  const check = { email, account }
  for (const key in check) {
    const value = check[key]
    const user = await User.findOne({ where: { [key]: value } })

    // setting page
    if (req.user) {
      if (user && value !== req.user[key]) {
        return { value, key }
      }
    }

    // register page
    if (!req.user && user) {
      return { value, key }
    }
  }
}

function getUserInfoId(req, info) {
  if (req.user[info]) return req.user[info].map(el => el.id)
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
  getSubscribers,
  getFollowshipInfo,
  getResourceInfo,
  checkUserInfo,
  getUserInfoId
}
