console.log('this is client')

// listen client
const socket = io('/');

socket.on('connect', () => {
  socket.userId = 11
  console.log(socket.handshake)
  console.log(`Client Successfully connected：${socket.id}`);
});

socket.emit('sendMessage', {
  name: 'major',
  message: 'hello everyone',
})

socket.on('allMessage', function (message) {
  console.log(message)
})

socket.emit('join', {
  roomId: 1
})

socket.on('debug notice', message => {
  console.log(message)
})

socket.on('active users', message => {
  console.log(message)
})

socket.on('message', message => {
  console.log(message)
})

socket.emit('public chat', { message: '這是一個公開聊天室訊息' })

socket.on('public chat', message => {
  console.log(message)
})

socket.emit('leave', { roomId: 1 })