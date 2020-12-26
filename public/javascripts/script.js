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

// update online users
socket.on('update-connected-users', (connectedUsers, authUserAccount, offlineUser) => {
  console.log('>>> ', connectedUsers, authUserAccount)

  // IF WE NEED TO EXCLUDE OURSELF, THEN UNCOMMENT THE FOLLOWING CODE
  // connectedUsers.forEach((element, i) => {
  //   console.log('**', element)
  //   if (element.sckId.includes(socket.id)) connectedUsers.splice(i, 1)
  // })

  document.querySelector('#connected-users-count').innerHTML = connectedUsers.length
  document.querySelector('#hidden-user-info').className = authUserAccount

  const onlineUserTabs = connectedUsers.map(user => `
    <div class="pr-1 py-2 d-flex align-items-center connected-user">
      <img class="user-avatar" src="${user.avatar}" alt="">
      <span>
        <strong>${user.name}</strong>
        <span class="text-gray">@${user.account}</span>
      </span>
    </div>
  `).join('')
  document.querySelector('.user-panel').innerHTML = onlineUserTabs
})

// get message from public message
socket.on('public-message', (public_packets) => {
  // console.log(public_packets)
  const userAccount = document.querySelector('#hidden-user-info').className
  const publicBoard = document.querySelector('.message-board')
  for (const packet of public_packets) {
    if (packet.account !== userAccount) {
      publicBoard.insertAdjacentHTML('beforeend', `
        <div class="message-wrapper d-flex align-items-end px-3 py-2">
          <img class="message-avatar" src="${packet.avatar}" alt="">
          <div class="message">
            <div class="message-text bg-gray">${packet.message}
            </div>
            <div class="message-time text-gray">${moment(packet.timestamp).fromNow()}</div>
          </div>
        </div>
      `)
    } else {
      publicBoard.insertAdjacentHTML('beforeend', `
        <div class="my-message-wrapper d-flex justify-content-end px-3 py-1">
          <div class="message w-100">
            <div class="d-flex justify-content-end">
              <div class="message-text my-message-text">${packet.message}</div>
            </div>
            <div class="message-time text-right text-gray">${moment(packet.timestamp).fromNow()}</div>
          </div>
        </div>
      `)
    }
  }
})

// public page
try {
  console.log('Detect in public page...')

  // initialize public room
  socket.emit('open-public-room', new Date().getTime())

  const publicMessageBtn = document.querySelector('.send-message-btn')
  publicMessageBtn.addEventListener('click', (e) => {
    e.preventDefault()

    const message = document.querySelector('input[name="message"]').value
    // console.log('[Send message] ', message)
    socket.emit('public-message', message, new Date().getTime())
    // console.log(e.target)
    document.querySelector('input[name="message"]').value = ''
  })
} catch (error) {
  console.log(error)
}






// const publicMessage = document.querySelector('.public-chat-room form')
const privateMessage = document.querySelector('.private-chat-rooms form')
// const publicBoard = document.querySelector('.public-chat-room ul')


// initialize public message
// publicMessage.addEventListener('DOMContentLoaded', (e) => {
//   console.log('Here!')
//   socket.emit('open-public-room', new Date().getTime())
// })

// initialize private message
privateMessage.addEventListener('DOMContentLoaded', (e) => {
  socket.emit('open-private-rooms', new Date().getTime())
})

socket.on('open-private-rooms', sortedRoomDetails => {
  console.log('[open-private-rooms][Get message] ', sortedRoomDetails)
})

// for handlebars to handle click private room
function privateRoomOnClick(channelId) {
  socket.emit('open-private-room', channelId, new Date().getTime())
}



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
