const { Server } = require('socket.io');

let io;
module.exports = {
  init(server) {
    io = new Server(server);
  },
  connect() {
    if (!io) throw new Error('No socket io server instance');
    io.on('connection', (socket) => {
      // welcome current user
      socket.emit('message', 'Welcome to Chat');
      // broadcast when a user connect
      socket.broadcast.emit('message', 'a user connected!');
      // Listen for chat message
      socket.on('chat message', (msg) => {
        io.emit('message', msg);
      });
      // run when client disconnect
      socket.on('disconnect', () => {
        io.emit('message', 'a user has left that chat');
      });
    });
  },
};
