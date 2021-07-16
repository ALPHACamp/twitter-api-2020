const socket = io()
// message from server
console.log('hi')

// get history messages
socket.on('history', data => {
  data.forEach(message => {
    if (message.isLoginUser === true) {
      // Sender Message
      chatmessage.innerHTML += `
        <div class="send-msg w-50 ml-auto mb-3">
          <div class="media-body">
            <div class=" rounded py-2 px-3 mb-2" style="background: #ff6600;">
              <p class="text-small mb-0 text-white">${message.text}</p>
            </div>
            <p class="small text-muted">${message.time}</p>
          </div>
        </div>
      `
    } else {
      // Reciever Message
      chatmessage.innerHTML += `
        <div class="media w-50 mb-3">
          <img src="${message.avatar}" alt="user"
            width="50" class="rounded-circle">
          <div class="media-body ml-3">
            <div class="bg-light rounded py-2 px-3 mb-2">
              <p class="text-small mb-0 text-muted">${message.text}</p>
            </div>
            <p class="small text-muted">${message.time}</p>
          </div>
        </div>
      `
    }
  })
})
socket.on('message', (data) => {
  chatmessage.innerHTML += `
    <div style="text-align: center">
      <div class="bg-light rounded py-2 px-3 mb-3" style="width:auto !important; display:inline-block">
        <p class=" text-small mb-0 text-muted">${data}</p>
      </div>
    </div>
  `
})

socket.on('onlineUsers', (data) => {
  let userlists = ''

  data.forEach(user => {
    userlists += `
      <div class="list-group rounded-0">
        <a class="list-group-item list-group-item-action text-white rounded-0 p-1"
              style="border:none; border-bottom: 1px solid #E6ECF0">
          <div class="media">
            <img class="m-1" src=${user.avatar}
                  style="background: #C4C4C4;border-radius: 100%; width: 50px; height: 50px">
              <div class="media-body ml-2 align-self-center">
                <div class="mb-1">
                  <span class="user-name">${activeUsers}</span>
                  <span class="user-account">@${user.account}</span><br>
                </div>
              </div>
          </div>
        </a>
      </div>
    `
    usertitle.innerHTML = `<p class="h5 mb-0 font-weight-bold">上線使用者(${data.length})</p>`
  })

  chatUserlist.innerHTML = userlists
})

// 監聽按鈕
document.querySelector('#button-addon2').addEventListener('click', () => {
  event.preventDefault()
  Send()
  console.log('send!')
  // console.log('send!')
})

function Send () {
  const msg = document.querySelector('#msg').value
  if (!msg) {
    alert('請輸入訊息!')
    return
  }
  const data = {
    msg: msg
  }
  appendData(msg)
  socket.emit('chat', msg)
  document.querySelector('#msg').value = ''
}
function appendData (data) {
  chatmessage.innerHTML += ` <div class="send-msg w-50 ml-auto mb-3">
      <div class="media-body">
        <div class=" rounded py-2 px-3 mb-2" style="background: #ff6600;">
          <p class="text-small mb-0 text-white">${data}</p>
        </div>
        <p class="small text-muted">${moment(data.time).fromNow()}</p>
      </div>
    </div>
  `
  scrollWindow()
}

function appendUser (users) {
  onlineuser.innerHTML += `
    <a class="list-group-item list-group-item-action text-white rounded-0 p-1"
      style="border:none; border-bottom: 1px solid #E6ECF0">
      <div class="media">
        <img class="m-1" {{#if user.avatar}}src={{user.avatar}}{{/if}}
          style="background: #C4C4C4;border-radius: 100%; width: 50px; height: 50px">
        <div class="media-body ml-2 align-self-center">
          <div class="mb-1">
            <span class="user-name">{{user.name}}</span>
            <span class="user-account">@${users.loginAvatar}</span><br>
          </div>
        </div>
      </div>
    </a>
  `
  scrollWindow()
}

// 傳送訊息給大家
socket.on('chat', data => {
  console.log('Get chat')
  console.log('chat data', data)
  chatmessage.innerHTML += `
        <div class="media w-50 mb-3">
          <img src="${data.avatar}" alt="user"
            width="50" class="rounded-circle">
          <div class="media-body ml-3">
            <div class="bg-light rounded py-2 px-3 mb-2">
              <p class="text-small mb-0 text-muted">${data.text}</p>
            </div>
            <p class="small text-muted">${data.time}</p>
          </div>
        </div>
      `
  scrollWindow()
})

function scrollWindow () {
  const h = document.querySelector('.chat-box')
  h.scrollTop = h.scrollHeight
}
