const socketio = require('socket.io')

const { authenticatedSocket } = require('../middleware/auth')
const db = require('../models')
const Message = db.Message

const { generateMessage } = require('./message')
const {
  interactionType,
  PUBLIC_ROOM_ID,
  getCurrentUserInfo,
  addUser,
  removeUser,
  getUsersInRoom,
  getAuthors,
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
      methods: ['GET', 'POST'],
      transports: ['websocket', 'polling'],
      credentials: true
    },
    allowEIO3: true
  })

  global.io.use(authenticatedSocket).on('connection', async socket => {
    console.log('===== connected!!! =====')
    console.log('socket.userId', socket.userId)

    await getCurrentUserInfo(socket)

    const userId = socket.user.id
    console.log('socket.user.id', socket.user.id)

    // session
    socket.on('start session', async data => {
      console.log('===== start session =====')
      console.log('data', data)
      console.log('userId', userId)
      console.log('socket.rooms0', socket.rooms)

      let rooms = []
      if (userId) {
        socket.join([`self ${userId}`, `${PUBLIC_ROOM_ID}`])
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

          rooms.push(`self ${userId}`, `${PUBLIC_ROOM_ID}`)
          console.log('rooms1 - start session', rooms)
        } else {
          rooms = data.rooms
          socket.join(rooms)

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

    // Tweet
    socket.on('notification', async ({ tweetId, tweet }) => {
      console.log('===== receive notification =====')
      console.log('data', { tweetId, tweet })

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
      console.log(`notify users in # ${socket.user.account} channel`)

      socket.broadcast.to(`# ${socket.user.account}`).emit('notification', {
        ...socket.user,
        tweet,
        tweetId,
        type: interactionType.tweet
      })
    })

    // like
    socket.on('like', async data => {
      console.log('===== receive like =====')
      console.log('data', data)

      if (data.userId) {
        data.userId = Number(data.userId)
      }

      await saveData({
        id: userId,
        currentUserId: data.userId,
        type: interactionType.like
      })

      console.log(`broadcast to self ${data.userId}`)

      socket.broadcast
        .to(`self ${data.userId}`)
        .emit('notification', { ...socket.user, type: interactionType.like })
    })

    // follow
    socket.on('follow', async data => {
      console.log('===== receive follow =====')
      console.log('data', data)

      if (data.userId) {
        data.userId = Number(data.userId)
      }

      await saveData({
        id: userId,
        currentUserId: data.userId,
        type: interactionType.follow
      })

      console.log(`broadcast to self ${data.userId}`)

      socket.broadcast
        .to(`self ${data.userId}`)
        .emit('notification', { ...socket.user, type: interactionType.follow })
    })

    // reply
    socket.on('reply', async data => {
      console.log('===== receive reply =====')
      console.log('data', data)

      if (data.userId) {
        data.userId = Number(data.userId)
      }

      await saveData({
        id: userId,
        currentUserId: data.userId,
        replyId: data.replyId,
        type: interactionType.reply
      })

      console.log(`broadcast to self ${data.userId}`)

      socket.broadcast.to(`self ${data.userId}`).emit('notification', {
        ...socket.user,
        replyId: data.replyId,
        reply: data.reply,
        type: interactionType.reply
      })
    })

    // join
    socket.on('join', async ({ username, roomId }) => {
      console.log('===== receive join =====')
      console.log('username', username)
      console.log('roomId', roomId)
      console.log('PUBLIC_ROOM_ID', PUBLIC_ROOM_ID)

      roomId = Number(roomId)
      socket.join(`${roomId}`)
      console.log('socket.rooms', socket.rooms)

      await updateTime(userId, roomId)

      if (roomId === PUBLIC_ROOM_ID) {
        await addUser({
          socketId: socket.id,
          roomId,
          userId,
          username
        })

        // count users
        const usersInRoom = await getUsersInRoom(roomId)

        console.log('usersInRoom', usersInRoom)

        io.to(`${roomId}`).emit('users count', {
          users: usersInRoom,
          userCount: usersInRoom.length
        })

        // notify everyone except the user
        socket.broadcast
          .to(`${roomId}`)
          .emit('message', generateMessage(`${username} 上線`))
      }
    })

    socket.on('chat message', async (msg, callback) => {
      console.log('===== receive chat message =====')
      console.log('msg', msg)

      await Message.create({
        UserId: userId,
        ChatRoomId: PUBLIC_ROOM_ID,
        message: msg.message
      })
      io.to(`${PUBLIC_ROOM_ID}`).emit(
        'chat message',
        generateMessage(msg.message, userId, socket.user.avatar)
      )

      // Event Acknowledgement
      callback()
    })

    // private
    socket.on('private chat message', async (msg, callback) => {
      console.log('===== receive private chat message =====')
      console.log('msg', msg)
      msg.roomId = Number(msg.roomId)

      await Message.create({
        UserId: userId,
        ChatRoomId: msg.roomId,
        message: msg.message
      })
      io.to(`${msg.roomId}`).emit(
        'private chat message',
        generateMessage(msg.message, userId, socket.user.avatar)
      )

      const otherUser = await getOtherUser(userId, msg.roomId)
      console.log('otherUser', otherUser)

      socket.broadcast.to(`self ${otherUser}`).emit('notice from private', {
        roomId: msg.roomId,
        message: msg.message,
        userId: userId
      })

      // notify another user
      if (msg.newMessage) {
        console.log(`broadcast new msg to channel self ${otherUser}`)

        socket.broadcast
          .to(`self ${otherUser}`)
          .emit(
            'private chat message',
            generateMessage(msg.message, msg.userId, socket.user.avatar, true),
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
        await updateTime(userId, roomId)
        if (roomId === PUBLIC_ROOM_ID) {
          await removeUser(socket)
        }
      }
    })

    socket.on('disconnect', async () => {
      console.log('===== disconnect =====')

      // remove user from public room record
      const user = await removeUser(socket)
      console.log('user', user)

      if (user) {
        // count users
        const usersInRoom = await getUsersInRoom(user.roomId)
        io.to(`${user.roomId}`).emit('users count', {
          users: usersInRoom,
          userCount: usersInRoom.length
        })

        io.to(`${user.roomId}`).emit(
          'message',
          generateMessage(`${user.username} 離線`)
        )
      }
    })
  })
}

module.exports = { socket }
