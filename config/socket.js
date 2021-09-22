// allowEIO3: Compatibility with Socket.IO v2 clients.
module.exports = {
  initialize(httpServer) {
    return require('socket.io')(httpServer, {
      cors: {
        origin: [
          'http://localhost:8080',
          'https://williamtsou818.github.io/',
          'http://localhost:3000'
        ],
        methods: ['GET', 'POST'],
        credentials: true
      },
      allowEIO3: true
    })
  }
}
