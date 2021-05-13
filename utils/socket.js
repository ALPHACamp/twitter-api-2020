const socketio = require('socket.io')

const db = require('../models')
const Message = db.Message

const { generateMessage } = require('./message')
const {
  interactionType,
  PUBLIC_ROOM_ID,
  addUser,
  getUser,
  removeUser,
  getUsersInRoom,
  getAuthors,
  getUserInfo,
  getOtherUser,
  updateTime,
  saveData,
  getSubscribers
} = require('./users')

const socket = server => {
  // Set up socket.io
  global.io = socketio(server, {
    cors: {
      origin: ['http://localhost:8080', 'https://ivyhungtw.github.io'],
      methods: ['GET', 'POST', 'DELETE'],
      transports: ['websocket', 'polling'],
      credentials: true
    },
    allowEIO3: true
  })
  global.io.on('connection', socket => {
    // session
    socket.on('start session', async (data, userId) => {
      console.log('===== start session =====')
      console.log('data', data)
      console.log('userId', userId)
      console.log('socket.rooms0', socket.rooms)

      let rooms = []
      if (userId) {
        socket.join(`self ${userId}`)
        socket.join(`${PUBLIC_ROOM_ID}`)
        console.log('socket.rooms1-1', socket.rooms)

        if (!data.rooms || !data.rooms.length) {
          const authors = await getAuthors(userId)
          console.log('authors', authors)

          if (authors) {
            rooms = authors.map(account => {
              socket.join(`# ${account}`)
              return `# ${account}`
            })
          }
          console.log('socket.rooms1-2', socket.rooms)

          rooms.push(`self ${userId}`)
          rooms.push(`${PUBLIC_ROOM_ID}`)
          console.log('rooms1 - start session', rooms)
        } else {
          rooms = data.rooms
          rooms.forEach(room => {
            socket.join(room)
          })
          console.log('socket.rooms2', socket.rooms)
          console.log('rooms2 - start session', rooms)
        }
      }
      console.log('rooms3 - start session', rooms)
      socket.emit('set session', { rooms })
    })

    // subscription
    socket.on('subscription', (data, account) => {
      console.log('===== receive subscription =====')
      console.log('data', data)
      console.log('account', account)

      socket.join(`# ${account}`)
      console.log('socket.rooms', socket.rooms)

      const rooms = data.rooms
      // set session
      if (rooms) {
        rooms.push(`# ${account}`)
        socket.emit('set session', { rooms })
      } else {
        socket.emit('set session', { rooms: [`# ${account}`] })
      }
    })

    // cancel subscription
    socket.on('cancel subscription', (data, account) => {
      console.log('===== receive cancel subscription =====')
      console.log('data', data)
      console.log('account', account)

      socket.leave(`# ${account}`)
      console.log('socket.rooms', socket.rooms)

      let rooms = data.rooms

      if (rooms) {
        const index = rooms.findIndex(room => room === `# ${account}`)
        rooms.splice(index, 1)
      }
      console.log('rooms', rooms)

      socket.emit('set session', { rooms })
    })

    // notification
    socket.on('notification', async ({ userId, tweetId, tweet }) => {
      console.log('===== receive notification =====')
      console.log('data', { userId, tweetId, tweet })

      const user = await getUserInfo(userId)

      console.log('user', user)

      if (user) {
        // Save to subscribers' notifications
        const subscribers = await getSubscribers(userId)
        if (subscribers) {
          await Promise.all(
            subscribers.map(subscriber => {
              return saveData({
                id: userId,
                currentUserId: subscriber,
                tweetId: tweetId,
                type: interactionType.tweet
              })
            })
          )
        }
        console.log(`notify users in # ${user.account} channel`)

        socket.broadcast.to(`# ${user.account}`).emit('notification', {
          ...user,
          tweet,
          tweetId,
          type: interactionType.tweet
        })
      }
    })

    // like
    socket.on('like', async data => {
      console.log('===== receive like =====')
      console.log('data', data)

      if (data.userId) {
        data.userId = Number(data.userId)
      }

      await saveData({
        id: data.currentUserId,
        currentUserId: data.userId,
        type: interactionType.like
      })
      const user = await getUserInfo(data.currentUserId)
      console.log('user', user)

      console.log(`broadcast to self ${data.userId}`)

      socket.broadcast
        .to(`self ${data.userId}`)
        .emit('notification', { ...user, type: interactionType.like })
    })

    // follow
    socket.on('follow', async data => {
      console.log('===== receive follow =====')
      console.log('data', data)

      if (data.userId) {
        data.userId = Number(data.userId)
      }

      await saveData({
        id: data.currentUserId,
        currentUserId: data.userId,
        type: interactionType.follow
      })

      const user = await getUserInfo(data.currentUserId)
      console.log('user', user)

      console.log(`broadcast to self ${data.userId}`)

      socket.broadcast
        .to(`self ${data.userId}`)
        .emit('notification', { ...user, type: interactionType.follow })
    })

    // reply
    socket.on('reply', async data => {
      console.log('===== receive reply =====')
      console.log('data', data)

      if (data.userId) {
        data.userId = Number(data.userId)
      }

      await saveData({
        id: data.currentUserId,
        currentUserId: data.userId,
        replyId: data.replyId,
        type: interactionType.reply
      })

      const user = await getUserInfo(data.currentUserId)
      console.log('user', user)

      console.log(`broadcast to self ${data.userId}`)

      socket.broadcast.to(`self ${data.userId}`).emit('notification', {
        ...user,
        replyId: data.replyId,
        reply: data.reply,
        type: interactionType.reply
      })
    })

    // join
    socket.on('join', async ({ username, roomId, userId }) => {
      console.log('===== receive join =====')
      console.log('username', username)
      console.log('roomId', roomId)
      console.log('userId', userId)

      const user = await addUser({
        socketId: socket.id,
        roomId,
        userId,
        username
      })
      socket.join(user.roomId)
      console.log('socket.rooms', socket.rooms)
      // reset session

      await updateTime(userId, roomId)

      if (roomId === PUBLIC_ROOM_ID) {
        // count users
        const usersInRoom = await getUsersInRoom(user.roomId)

        console.log('usersInRoom', usersInRoom)

        io.to(user.roomId).emit('users count', {
          users: usersInRoom,
          userCount: usersInRoom.length
        })

        // notify everyone except the user
        socket.broadcast
          .to(user.roomId)
          .emit('message', generateMessage(`${username} 上線`))
      }
    })

    socket.on('chat message', async (msg, callback) => {
      console.log('===== receive chat message =====')
      console.log('msg', msg)

      const user = await getUser(socket.id)
      console.log('user', user)

      await Message.create({
        UserId: user.userId,
        ChatRoomId: user.roomId,
        message: msg.message
      })
      io.to(user.roomId).emit(
        'chat message',
        generateMessage(msg.message, user.userId, user.avatar)
      )

      // Event Acknowledgement
      callback()
    })

    // private
    socket.on('private chat message', async (msg, callback) => {
      console.log('===== receive private chat message =====')
      console.log('msg', msg)

      const user = await getUser(socket.id, msg.userId)
      console.log('user', user)

      await Message.create({
        UserId: msg.userId,
        ChatRoomId: msg.roomId,
        message: msg.message
      })
      io.to(msg.roomId).emit(
        'private chat message',
        generateMessage(msg.message, msg.userId, user.avatar)
      )

      const otherUser = await getOtherUser(msg.userId, msg.roomId)
      console.log('otherUser', otherUser)

      socket.broadcast.to(`self ${otherUser}`).emit('notice from private', {
        roomId: msg.roomId,
        message: msg.message,
        userId: msg.userId
      })

      // notify another user
      if (msg.newMessage) {
        console.log(`broadcast new msg to channel self ${otherUser}`)

        socket.broadcast
          .to(`self ${otherUser}`)
          .emit(
            'private chat message',
            generateMessage(msg.message, msg.userId, user.avatar, true),
            msg.roomId
          )
      }

      // Event Acknowledgement
      callback()
    })

    // user switch to other private room
    socket.on('leave', async (userId, roomId) => {
      console.log('===== receive leave =====')
      console.log('userId', userId)
      console.log('roomId', roomId)

      if (roomId) {
        socket.leave(`${roomId}`)
        await removeUser(socket.id, roomId, userId)
      }
    })

    socket.on('disconnect', async () => {
      console.log('===== disconnect =====')

      const user = await removeUser(socket.id)
      console.log('user', user)

      if (user) {
        // count users
        const usersInRoom = await getUsersInRoom(user.roomId)
        io.to(user.roomId).emit('users count', {
          users: usersInRoom,
          userCount: usersInRoom.length
        })

        io.to(user.roomId).emit(
          'message',
          generateMessage(`${user.username} 離線`)
        )
      }
    })
  })
}

module.exports = { socket }
