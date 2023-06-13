// const socketIO = require('socket.io')

// const webSocketController = {
//   initWebSocket (server) {
//     const io = socketIO(server)

//     io.on('connection', (socket) => {
//       const user = socket.request.user
//       console.log('使用者連線' + user)

//       socket.on('chat message', (msg) => {
//         console.log('收到訊息:', msg)
//         socket.broadcast.emit('chat message', msg) // use broadcast.emit to send to all socket
//         socket.emit('chat message', msg) // user .emit to sent to sender
//         // webSocketController.saveMessage(msg)
//       })

//       socket.on('disconnect', () => {
//         console.log('使用者斷開連線')
//       })
//     })
//   }

//   // saveMessage (message) {
//   //   const query = 'INSERT INTO messages (content) VALUES (?)'
//   //   const values = [message]

//   //   connection.query(query, values, (error, results, fields) => {
//   //     if (error) {
//   //       console.error('Error saving message:', error)
//   //     }
//   //   })
//   // }
// }

// module.exports = webSocketController
