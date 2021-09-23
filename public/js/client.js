console.log('this is client')

// listen client
const socket = io('/');

socket.on('connect', (server) => {
  console.log(server)
  console.log(`Client Successfully connected：${socket.id}`);
});

socket.emit('sendMessage', {
  name: 'majer',
  message: 'hello everyone',
})

socket.on('allMessage', function (message) {
  console.log(message)
})