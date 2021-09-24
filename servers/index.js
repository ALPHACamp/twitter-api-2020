// 登入成功以後，更新上線名單

module.exports = (server) => {
  const io = require('socket.io')(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    },
  })

  const onlineUser = new Map()

  io.on('connection', socket => {
    const user = socket.handshake.query //id,name
    user.socketId = socket.id
    console.log('a user is connect')

    require('./public')(io, socket, user)


    socket.on('disconnect', () => {
      console.log('a user disconnected')
    })
  })

}