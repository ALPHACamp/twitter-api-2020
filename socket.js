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

  sio.on('connection', (socket) => { // 建立連線
    console.log('a user connected')
    //歷史訊息
    PublicMessage.findAll()
      .then(msg => {
        if (!msg) return
        msg.map(m => {
          socket.emit('self', m.message) //連上線之後，自己會出現歷史訊息
        })
      })

    socket.on('message', (msg, err) => {// server 收到 client 的訊息 (Emitting events:client往通道內丟的訊息)
      console.log(msg)

      //轉發
      socket.broadcast.emit('other', msg.msg) // broadcast：再透過通道把msg轉發給其他聊天室的使用者 
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



