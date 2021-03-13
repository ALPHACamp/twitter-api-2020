const db = require('./models')
const { PublicMessage } = db

module.exports = socket = (httpServer) => {
  const sio = require('socket.io')(httpServer, {
    cors: {
      // origin: "https://twitter-simple-one.herokuapp.com/api",
      origin: "*",
      methods: ["GET", "POST"]
    }
  })

  sio.on('connection', (socket) => { // 建立連線
    console.log('a user connected')
    //歷史訊息
    PublicMessage.findAll()
      .then(msg => {
        msg.map(m => {
          socket.emit('message', m.message) //連上線之後會出現歷史訊息
        })
      })
    socket.on('message', (msg, err) => {// server 收到 client 的訊息 (Emitting events:client往通道內丟的訊息)
      console.log(msg)
      //存入資料庫
      PublicMessage.create({
        message: msg,
        UserId: 11
      })
      //轉發
      socket.broadcast.emit('other', msg) // broadcast：再透過通道把msg轉發給其他聊天室的使用者 
      socket.emit('self', msg) //emit：再透過通道把msg傳給自己 
    })
  })
}



