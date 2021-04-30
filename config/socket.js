const socket = (httpServer) => {
  const options = {
    cors: {
      origin: 'http://localhost:8080/',
      methods: ['GET', 'POST'],
      allowedHeaders: ['my-custom-header'],
      credentials: true
    }
  }
  const io = require('socket.io')(httpServer, options)
  io.on('connection', socket => {
    socket.on('hello', (arg) => {
      console.log(arg)
    })
  })
}

module.exports = socket
