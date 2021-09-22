const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
})
const button = document.querySelector('.chat-button')
const talk = document.querySelector('.talk-button')

const socket = io(window.location.origin)

if (button) {
  button.addEventListener('click', event => {
    socket.emit('join-room', { roomId: '3', targetId: '2' })
  })
}

if (talk) {
  talk.addEventListener('click', event => {
    socket.emit('chatMessage', { msg: 'Hello', roomId: '3' })
  })
}

socket.on('chatMessage', (message) => {
  console.log(message)
})



const userId = Math.floor(Math.random() * 7)
console.log("🚀 ~ file: client.js ~ line 7 ~ userId", userId)

// 連線並送出user id
socket.emit('connectServer', { userId });

// 監聽是否有朋友上線
socket.on('online-notice', (message) => {
  console.log(message)
})

socket.on('3', (msg) => {
  console.log(msg)
})
