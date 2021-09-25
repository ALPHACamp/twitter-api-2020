const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
})
const button = document.querySelector('.chat-button')
const talk = document.querySelector('.talk-button')

const socket = io(window.location.origin)

// 連線並送出user id
socket.emit('connectServer', userId);

// 觸發加入公開聊天室
if (button) {
  button.addEventListener('click', event => {
    socket.emit('join-public-room', userId)
  })
}

//監聽接收公開聊天室的紀錄
socket.on('public-chat-record', (publicChatRecord) => {

})

// 監聽接收線上使用者列表及所有使用者資料
socket.on('online-list', (onlineIdList, allUsers) => {

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

// 向公開聊天室發送訊息
socket.emit('public-msg', { userId, message })

// 以上公開聊天室

// 以下私訊
// 加入私人房間
if (button) {
  button.addEventListener('click', event => {
    socket.emit('join-room', { userId: '3', targetId: '2', roomId: '2' })
  })
}

if (talk) {
  talk.addEventListener('click', event => {
    socket.emit('chatMessage', { msg: 'Hello', roomId: '3', userId: 2 })
  })
}

socket.on('room-info', { roomId, targetId, chatRecord })

socket.on('chatMessage', ({ message, roomId }) => {
  console.log(message, roomId)
})

socket.on('chat-offline-notice', (userId) => {
  console.log(userId)
})
