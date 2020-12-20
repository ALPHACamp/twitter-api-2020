//建立socket.io連線
var socket = io({
  query: { token: localStorage.getItem('token') }
})

const publicMessage = document.querySelector('.public-chat-room form')
const privateMessage = document.querySelector('.private-chat-rooms form')
const publicBoard = document.querySelector('.public-chat-room ul')

//即時更新在線使用者(已排除自己)
socket.on('update-connected-users', (connectedUsers) => {
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

socket.on('public-message', (sender, message, timestamp) => {
  publicBoard.insertAdjacentHTML('beforeend', `
    <li class="list-group-item">
      <strong class="mr-2">${sender.name}:</strong>${message} 
      <small class="ml-2">${moment(timestamp).fromNow()}</small>
    </li>
  `)
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

socket.on('private-message', (sender, message, timestamp) => {
  console.log(`receive PM from ${sender.name} : ${message} (${timestamp})`)

  let privateRoom = document.querySelector(`#with-${sender.id}`)
  if (!privateRoom) {
    document.querySelector('.private-chat-rooms .boards').insertAdjacentHTML('beforeend', `
      <div class="col private-chat-room" id="with-${sender.id}">
        <h4>with: ${sender.name}</h4>
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

