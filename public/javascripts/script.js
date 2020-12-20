var socket = io({
  query: { token: localStorage.getItem('token') }
})
const publicMessage = document.querySelector('.public-chat-room form')
const privateMessage = document.querySelector('.private-chat-rooms form')
const publicBoard = document.querySelector('.public-chat-room ul')

//public room
publicMessage.addEventListener('submit', (e) => {
  e.preventDefault()
  const message = e.target.querySelector('input').value
  socket.emit('public-message', message)
  return false
})

socket.on('public-message', (anotherSocketId, message) => {
  publicBoard.insertAdjacentHTML('beforeend', `
    <li class="list-group-item">
      <strong>${anotherSocketId}:</strong>
      ${message}
    </li>
  `)
})

//private message
privateMessage.addEventListener('submit', (e) => {
  e.preventDefault()
  const message = e.target.querySelector('input').value
  socket.emit('private-message', socket.id, message)
  return false
})

socket.on('private-message', (anotherSocketId, message) => {
  let privateRoom = document.querySelector(`#with-${anotherSocketId}`)
  if (!privateRoom) {
    document.querySelector('.private-chat-rooms .boards').insertAdjacentHTML('beforeend', `
      <div class="col private-chat-room" id="with-${anotherSocketId}">
        <h4>with: ${anotherSocketId}</h4>
        <ul class="list-group board">
          <li class="list-group-item">
            <strong>${anotherSocketId}:</strong>
            ${message}
          </li>            
        </ul>
      </div>
    `)
  } else {
    privateRoom.querySelector('.board').insertAdjacentHTML('beforeend', `
      <li class="list-group-item">
        <strong>${anotherSocketId}:</strong>
        ${message}
      </li>
  `)
  }
})

//error handling
socket.on('connect_error', (error) => {
  console.log(error.message)
})