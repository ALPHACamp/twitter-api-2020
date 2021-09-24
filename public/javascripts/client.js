const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
})
const button = document.querySelector('.chat-button')
const talk = document.querySelector('.talk-button')

const socket = io(window.location.origin)

// 連線並送出user id
socket.emit('connectServer', Math.floor(Math.random()* 9));

// 公開聊天室
socket.on('online-list', (onlineIdList, allUsers) => {

})

socket.on('public-online-notice', (userId) => {

})

socket.on('public-offline-notice', (userId) => {

})

socket.on('public-msg', ({ userId, message }) => {

})

socket.emit('public-msg', { userId, message })

// 以上公開聊天室


if (button) {
  button.addEventListener('click', event => {
    socket.emit('join-room', { roomId: '3', targetId: '2' })
  })
}

if (talk) {
  talk.addEventListener('click', event => {
    socket.emit('chatMessage', { msg: 'Hello', roomId: '3', targetId: 2 })
  })
}

socket.on('chatMessage', (message) => {
  console.log(message)
})

socket.on('unread', (msg) => {
  console.log(msg.message)
})



const userId = Math.floor(Math.random() * 7)
console.log("🚀 ~ file: client.js ~ line 7 ~ userId", userId)



// 監聽是否有朋友上線
socket.on('online-notice', (message) => {
  console.log(message)
})

socket.on('3', (msg) => {
  console.log(msg)
})
