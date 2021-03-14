const db = require('./models')
const { PublicMessage, User } = db

module.exports = socket = (httpServer) => {
  const sio = require('socket.io')(httpServer, {
    cors: {
      // origin: "https://twitter-simple-one.herokuapp.com",
      origin: "*",
      methods: ["GET", "POST"]
    }
  })

  let users = [];

  sio.on('connection', (socket) => { // 建立連線
    console.log('a user connected')
    //歷史訊息
    // PublicMessage.findAll({ where: { UserId: 11 }, include: User, raw: true, nest: true })
    //   .then(msg => {
    //     if (!msg) return
    //     msg.map(m => {
    //       const { id, name, account, avatar, createdAt } = m.User
    //       socket.emit('self', { msg: m.message, id, name, account, avatar, createdAt }) //連上線之後，自己會出現歷史訊息
    //     })
    //   })

    //歷史訊息
    socket.on('messages', (msg, err) => {
      PublicMessage.findAll({
        where: { UserId: 11 },
        include: User,
        raw: true,
        nest: true
      })
        .then((msgs) => {
          if (!msgs) return
          msgs.map(m => {
            const { id, name, account, avatar, createdAt } = m.User
            socket.emit('getAllMessages', { msg: m.message, id, name, account, avatar, createdAt }) //連上線之後，自己會出現歷史訊息
          })
        })
    })

    // 取得線上使用者
    socket.on('getUsers', (data, err) => {
      const usersArray = data.map((m) => {
        return {
          id: m.id,
          name: m.name,
          avatar: m.avatar
        }
      })

      socket.emit('recieveUsers', usersArray)
    })

    // 多人通信
    socket.on('sendPublic', (data, err) => {

      //撈自己的info
      User.findAll({ where: { id: data.userId } })
        .then((user) => {
          const { id, name, avatar, account, createdAt } = user[0].dataValues

          io.sockets.emit('recievePublic', { msg: msg.msg, id, account, name, avatar, createdAt })

          // socket.broadcast.emit('other', { msg: msg.msg, id, account, name, avatar, createdAt })

          // socket.emit('self', { msg: msg.msg, id, account, name, avatar, createdAt }) //emit：再透過通道把msg傳給自己 
        }).then(() => {
          //存入資料庫
          PublicMessage.create({
            message: data.text,
            UserId: data.userId
          })
        })
    })

    // 上線事件
    socket.on('sendOnline', (data, err) => {
      const socketId = socket.id
      const userData = {
        id: data.userId,
        name: data.name,
        avatar: data.avatar,
        socketId: socketId
      }

      users.add(userData)

      io.sockets.emit('recieveOnline', userData)
    })

    // 下線事件
    socket.on('sendOffline', (data, err) => {
      const id = data.userId
      const users = users.filter((item) => {
        return item.id != id
      })

      io.sockets.emit('sendOffline', users)
    })


    // 保留原方法
    socket.on('message', (msg, err) => {// server 收到 client 的訊息 (Emitting events:client往通道內丟的訊息)
      console.log(msg)

      //轉發
      // socket.broadcast.emit('other', { msg: msg.msg }) // broadcast：再透過通道把msg轉發給其他聊天室的使用者 

      //撈自己的info
      User.findAll({ where: { id: 11 } })
        .then(user => {
          const { id, name, avatar, account, createdAt } = user[0].dataValues

          socket.broadcast.emit('other', { msg: msg.msg, id, account, name, avatar, createdAt })

          socket.emit('self', { msg: msg.msg, id, account, name, avatar, createdAt }) //emit：再透過通道把msg傳給自己 
        })

      //存入資料庫
      PublicMessage.create({
        message: msg.msg,
        UserId: 11
      })
    })

    socket.on('other', (msg, err) => {// server 收到 client 的訊息 (Emitting events:client往通道內丟的訊息)
      console.log(msg)

      //轉發
      socket.broadcast.emit('other', { msg: msg.msg }) // broadcast：再透過通道把msg轉發給其他聊天室的使用者 

      //撈自己的info
      User.findAll({ where: { id: 11 } })
        .then(user => {
          const { id, name, avatar, account, createdAt } = user[0].dataValues
          socket.emit('self', { msg: msg.msg, id, account, name, avatar, createdAt }) //emit：再透過通道把msg傳給自己 
        })

      //存入資料庫
      PublicMessage.create({
        message: msg.msg,
        UserId: 11
      })
    })
  })
}



