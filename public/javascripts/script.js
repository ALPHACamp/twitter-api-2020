//建立socket.io連線
let socket
try {
  socket = io({
    query: { token: localStorage.getItem('token') }
  })
  console.log('Get token on localstorage')
} catch (error) {
  alert('暫時無網路連線！')
}

const publicMessage = document.querySelector('.public-chat-room form')
const privateMessage = document.querySelector('.private-chat-rooms form')
const publicBoard = document.querySelector('.public-chat-room ul')

// initialize private message
privateMessage.addEventListener('DOMContentLoaded', (e) => {
  socket.emit('open-private-rooms', new Date().getTime())
})
socket.on('open-public-room', someData)

// initialize public message
publicMessage.addEventListener('DOMContentLoaded', (e) => {
  socket.emit('open-public-room', new Date().getTime())
})
socket.on('open-private-rooms', someData)


// update online users
socket.on('update-connected-users', (connectedUsers) => {
  // exclude myself
  connectedUsers.forEach((element, i) => {
    if (element.sckId.includes(socket.id)) connectedUsers.splice(i, 1)
  })

  const userRadios = connectedUsers.map(user => `
    <div class="form-check col-3">
      <input class="form-check-input" type="radio" name="recipient" id="${user.id}" value="${user.id}">
      <label class="form-check-label" for="${user.id}">
        ${user.name}
      </label>
    </div>
  `).join('')
  document.querySelector('.connected-users').innerHTML = userRadios
})

///發訊息給所有人(public聊天室)
publicMessage.addEventListener('submit', (e) => {
  e.preventDefault()
  const message = e.target.querySelector('input').value
  socket.emit('public-message', message, new Date().getTime())
  console.log(e.target)
  e.target.querySelector('input[name="message"]').value = ''
  return false
})

// get message from public message
socket.on('public-message', (public_packets) => {
  // console.log(public_packets)
  for (const packet of public_packets) {
    publicBoard.insertAdjacentHTML('beforeend', `
    <li class="list-group-item">
      <strong class="mr-2">${packet.name}:</strong>${packet.message} 
      <small class="ml-2">${moment(packet.timestamp).fromNow()}</small>
    </li>
  `)
  }
})

//私訊
privateMessage.addEventListener('submit', (e) => {
  e.preventDefault()
  const formData = new FormData(privateMessage)
  const recipientId = formData.get('recipient')
  const message = formData.get('message')
  socket.emit('private-message', recipientId, message, new Date().getTime())
  e.target.querySelector('input[name=message]').value = ''
  console.log(`PM ${recipientId}: ${message} (${new Date().getTime()})`)
  return false
})

// get message from private message
socket.on('private-message', (sender, message, timestamp, roomId, roomUsers) => {
  console.log(`receive PM on room ${roomId} from ${sender.name} : ${message} (${timestamp})`)

  let selfUser;
  let otherUser;
  roomUsers.forEach(user => {
    if (user.socketId.includes(socket.id)) selfUser = user
    else otherUser = user
  })

  let chatroomName = otherUser.name
  let privateRoom = document.querySelector(`#at-room-${roomId}`)
  if (!privateRoom) {
    document.querySelector('.private-chat-rooms .boards').insertAdjacentHTML('beforeend', `
      <div class="col private-chat-room" id="at-room-${roomId}">
        <h4>at: ${chatroomName}</h4>
        <ul class="list-group board">
          <li class="list-group-item">
            <strong class="mr-2">${sender.name}:</strong>${message}            
            <small class="ml-2">${moment(timestamp).fromNow()}</small>
          </li>            
        </ul>
      </div>
    `)
  } else {
    privateRoom.querySelector('.board').insertAdjacentHTML('beforeend', `
      <li class="list-group-item">
        <strong class="mr-2">${sender.name}:</strong>${message}
        <small class="ml-2">${moment(timestamp).fromNow()}</small> 
      </li>
  `)
  }
})

//error handling
//連線失敗(例如:未授權)
socket.on('connect_error', (error) => {
  console.log(error.message)
})
//連線成功後發生的錯誤
socket.on('error', (errorMsg) => {
  console.log(errorMsg)
})

socket.on('disconnect', () => {
  console.log('Fail to connect with server. Close socket...')
  socket.close()
})
