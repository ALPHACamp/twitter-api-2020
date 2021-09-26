const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
})
const button = document.querySelector('.chat-button')
const talk = document.querySelector('.talk-button')

const socket = io(window.location.origin)

// 連線並送出user id
socket.emit('connectServer', userId);

// 接收通知  new
socket.on('notices', (notice) => {

})

socket.on('read-notice', (notice) => {

})

// 讀取通知  new
if (button) {
  button.addEventListener('click', event => {
    socket.emit('read-notice', userId)
  })
}


// 觸發加入公開聊天室
if (button) {
  button.addEventListener('click', event => {
    socket.emit('join-public-room', userId)
  })
}

if (button) {
  button.addEventListener('click', event => {
    // 向公開聊天室發送訊息
    socket.emit('public-msg', { userId, message })
  })
}

//監聽接收公開聊天室的紀錄
socket.on('public-chat-record', (publicChatRecord) => {

})

// 監聽接收線上使用者列表及所有使用者資料
socket.on('online-list', (inRoomUsers) => {

})

// 監聽公開聊天室公告廣播
socket.on('public-online-notice', (userId) => {

})

// 監聽公開聊天室使用者下線訊息
socket.on('public-offline-notice', (userId) => {

})

// 監聽公開聊天室聊天訊息
socket.on('public-msg', ({ userId, message }) => {

})



// 以上公開聊天室

// 以下私訊
// 加入私人房間
if (button) {
  button.addEventListener('click', event => {
    socket.emit('join-room', { roomId: '2' })
  })
}

if (talk) {
  talk.addEventListener('click', event => {
    socket.emit('chatMessage', { msg: 'Hello', roomId: '3', userId: 2 })
  })
}

socket.on('personal-online-notice', (userId) => {

})

socket.on('room-info', { roomId, targetId, chatRecord })

socket.on('chatMessage', ({ message, roomId }) => {
  console.log(message, roomId)
})

socket.on('chat-offline-notice', (userId) => {
  console.log(userId)
})
