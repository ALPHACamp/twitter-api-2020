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
    socket.on('message', (msg, err) => {// server 收到 client 的訊息 (Emitting events:client往通道內丟的訊息)
      console.log(msg)
      socket.broadcast.emit('other', msg) // broadcast：再透過通道把msg轉發給其他聊天室的使用者 
      socket.emit('self', msg) //emit：再透過通道把msg傳給自己 
    })
  })
}



