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

// update online users for public
socket.on('update-connected-users', (connectedUsers, offlineUser) => {
  console.log('>>> ', connectedUsers)

  let authUser;
  connectedUsers.forEach((element, i) => {
    if (element.sckId.includes(socket.id)) authUser = element
  })
  document.querySelector('#hidden-user-info').className = authUser.account

  try {
    document.querySelector('#connected-users-count').innerHTML = connectedUsers.length

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
  } catch (error) {
    console.log('not in public page cannot render connected online users')
  }
})

// get message from public message
socket.on('public-message', (publicPackets) => {
  // console.log(publicPackets)

  const showFlag = checkShowFlag(publicPackets.length, 0)
  console.log('checkShowFlag: ', showFlag)

  if (showFlag) {
    const userAccount = document.querySelector('#hidden-user-info').className
    console.log('showFlag is true is userAccount: ', userAccount)
    const publicBoard = document.querySelector('.message-board')
    for (const packet of publicPackets) {
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
  }
})

// public page
try {
  const detector = document.querySelector('.public-middle-column')
  if (!detector) throw Error('not in public page')

  const publicMessageBtn = document.querySelector('.send-message-btn')
  console.log('Detect in public page...')

  // initialize public room
  socket.emit('open-public-room', new Date().getTime())
  localStorage.setItem('cid', '0')

  publicMessageBtn.addEventListener('click', (e) => {
    e.preventDefault()

    const message = document.querySelector('input[name="message"]').value
    socket.emit('public-message', message, new Date().getTime())
    document.querySelector('input[name="message"]').value = ''
  })
} catch (error) {
  console.log(error)
}

socket.on('open-private-rooms', sortedRoomDetails => {
  console.log('[open-private-rooms][Get message] ', sortedRoomDetails)
  const privateChatroom = sortedRoomDetails.map(room => `
      <div id="hidden-channel-info" data-userid="${room.uid}" data-channel="${room.channelId}" style="cursor: pointer">
        <div class="py-2 d-flex align-items-center connected-user">
          <img class="user-avatar flex-shrink-0" src="${room.avatar}" alt="">
            <div class="user-wrapper flex-shrink-1">
              <div>
                <strong class="private-user-name">${room.name}</strong>
                <span class="text-gray private-user-account">@${room.account}</span>
                <span class="text-gray">${moment(room.time).fromNow()}</span>
              </div>
              <div class="message-view">${room.message}</div>
            </div>
        </div>
      </div>
  `).join('')
  document.querySelector('.user-panel').innerHTML = privateChatroom
})

function checkShowFlag(packetsLength, firstPacketChannelId) {
  if (packetsLength !== 1) return true
  if (packetsLength === 1 && Number(localStorage.getItem('cid')) === firstPacketChannelId) return true

  return false
}

// get message from private message
socket.on('private-message', (privatePackets) => {
  console.log(privatePackets)

  const showFlag = checkShowFlag(privatePackets.length, privatePackets[0].ChannelId)

  if (showFlag) {
    const userAccount = document.querySelector('#hidden-user-info').className
    console.log('userAccount:', userAccount)
    const privateBoard = document.querySelector('.message-board')
    for (const packet of privatePackets) {
      if (packet.account !== userAccount) {
        privateBoard.insertAdjacentHTML('beforeend', `
        <div class="message-wrapper d-flex align-items-end px-3 py-2">
          <img class="message-avatar" src="${packet.avatar}" alt="">
          <div class="message">
            <div class="message-text bg-gray">
              ${packet.message}
            </div>
            <div class="message-time text-gray">${moment(packet.timestamp).fromNow()}</div>
          </div>
        </div>
      `)
      } else {
        privateBoard.insertAdjacentHTML('beforeend', `
        <div class="my-message-wrapper d-flex justify-content-end px-3 py-1">
          <div class="message w-100">
            <div class="d-flex justify-content-end">
              <div class="message-text my-message-text">${packet.message}</div>
            </div>
            <div class="message-time text-right text-gray">${moment(packet.timestamp).fromNow()}</div>
          </div>
        </div>
      </div>
      `)
      }
    }
  }
})

// private page
try {
  const detector = document.querySelector('.private-middle-column')
  if (!detector) throw Error('not in private page')

  console.log('Detect in private page...')

  // initialize private room
  socket.emit('open-private-rooms', new Date().getTime())
  localStorage.setItem('cid', '-1')

  // change another chatroom
  const privateUserPanel = document.querySelector('.user-panel')
  privateUserPanel.addEventListener('click', (event) => {
    document.querySelector('.message-board').innerText = ''

    document.querySelector('.message-form').classList.remove('hidden-component')

    let target = event.target
    while (target.id !== 'hidden-channel-info') {
      target = target.parentElement
    }

    const channelId = target.dataset.channel
    const recipientId = target.dataset.userid

    document.querySelector('.private-room-title-userid').innerText = recipientId
    document.querySelector('.private-room-title-username').innerText = target.querySelector('.private-user-name').innerText
    document.querySelector('.private-room-title-account').innerText = target.querySelector('.private-user-account').innerText


    console.log('>>> channel: ', channelId)
    localStorage.setItem('cid', channelId)
    // for handlebars to handle click private room
    socket.emit('open-private-room', channelId, new Date().getTime())
  })

  const privateMessageBtn = document.querySelector('.send-message-btn')
  privateMessageBtn.addEventListener('click', (e) => {
    e.preventDefault()

    const message = document.querySelector('input[name="message"]').value
    const recipientId = document.querySelector('.private-room-title-userid').innerText

    console.log('[Send out private] ', recipientId, message)
    socket.emit('private-message', recipientId, message, new Date().getTime())
    document.querySelector('input[name="message"]').value = ''
  })

} catch (error) {
  console.log(error)
}

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
