// alert auto dismiss
window.setTimeout(function () {
  $(".alert").alert('close')
}, 3000);

let notifyCounts = 0

document.addEventListener("DOMContentLoaded", () => {
  let socket = io();
  let status = document.getElementById("status");
  let online = document.getElementById("online");
  let userSide = document.getElementById("users");
  let sendForm = document.getElementById("send-form").childNodes[1];
  let userInfo = document.getElementById("userInfo")
  let privateBadge = document.getElementById("private-badge")

  socket.emit('login', $('#userName').val())

  $('form').submit(function () {
    if ($('#text-input-area').val() !== '') {
      socket.emit('chat message', $('#text-input-area').val(), $('#userId').val(), $('#userAvatar').val(), $('#userName').val())
      $('#text-input-area').val('')
    } else {
      sendForm.classList.add("wrong");
      sendForm.addEventListener('animationend', event => event.target.classList.remove('wrong'), { once: true })
    }
    return false;
  });
  socket.emit('join-me', $('#userId').val())

  // socket.on("connect", function () {
  //   status.classList.remove("disconnected")
  //   status.innerText = `Connected`;
  //   status.classList.add("connected")
  // });

  // socket.on("disconnect", function () {
  //   status.classList.add("connected")
  //   status.innerText = `Disconnected`;
  //   status.classList.add("disconnected")
  // });

  // user list
  socket.on("online", function (amount, userlist) {
    online.innerText = amount;
    let userlistColumn = ``
    for (i = 0; i < userlist.length; i++) {
      userlistColumn += `        
        <li class="d-flex border-bottom my-2 mb-1 w-100">
        <div class="photo-wrapper">
          <img src="${userlist[i].avatar}" alt="" class="photo rounded-circle" style="width: 50px;
  height: 50px; margin: 0.5rem 0.5rem 1rem 0.5rem;">
        </div>
        <div class="user-list-item-wrapper flex-column ml-1 w-100">
          <div class="upper-wrapper w-100 d-flex justify-content-between align-items-center mb-1">
            <div class="user-list-item-info d-flex">
              <div class="user-list-name font-weight-bold">${userlist[i].name}</div>
              <div class="user-list-account">&nbsp;@${userlist[i].account}</div>
            </div>
          </div>
        </div>
      </div>
      </li>
        `
    }
    userSide.innerHTML = userlistColumn;
    window.scrollTo(0, document.body.scrollHeight);
  });

  socket.on("oneLogin", function (user) {
    let userMsg = `
          <li>
          <span class="w-100">${user} 上線。</span>
          </li>
          `
    $('#messages').append(userMsg);
    $('#messages').scrollTop($('#messages')[0].scrollHeight - 50)
  })

  socket.on("oneLeave", function (user) {
    let userMsg = `
          <li>
          <span class="w-100">${user} 離線。</span>
          </li>
          `
    $('#messages').append(userMsg);
    $('#messages').scrollTop($('#messages')[0].scrollHeight - 50)
  })

  socket.on('send message', function (msg, id, avatar, name) {
    const event = new Date().toLocaleTimeString('zh-TW', { timeZone: 'Asia/Taipei', hour: '2-digit', minute: '2-digit' })
    let chatColumn = ``
    if ($('#userId').val() === id) {
      chatColumn = `
      <li id="login-user-item" class="d-flex flex-column align-items-end my-4">        
          <div class="loginuser-message-style message-text">${msg}</div>
          <div class="time login-user-time">${event}</div>
      </li>
        `
    } else {
      chatColumn = `
        <li id="other-user-item" class="d-flex justify-content-start align-items-center my-4">
        <img src="${avatar}" alt="">
        <div class="d-flex flex-column" style="max-width: 65%;">
          <div class="otheruser-message-style message-text">${msg}</div>
          <div class="time other-user-time">${event}</div>
        </div>
      </li>
        `
    }
    $('#messages').append(chatColumn);
    $('#messages').scrollTop($('#messages')[0].scrollHeight - 50)

    // if ($('#messages').children.length > max_record) {
    //   rmMsgFromBox();
    // }
  });

  socket.on("chatRecord", function (msgs, userName) {
    let chatColumn = ``
    for (let i = 0; i < msgs.length; i++) {
      if (userName === msgs[i].User.name) {
        chatColumn = `
        <li class="loginuser-message-style w-100 my-4">
          <img src="${msgs[i].User.avatar}" alt="">
            <div id="message-bubble">
              <strong>${msgs[i].User.name}</strong>
              <p class="message-text py-1">${msgs[i].chatMessage}</p>
              <div id='time' class="text-right login-user-time">${new Date(msgs[i].createdAt).toLocaleTimeString('zh-TW', { timeZone: 'Asia/Taipei', hour: '2-digit', minute: '2-digit' })}</div>
            </div>
        </li>
        `
      } else {
        chatColumn = `
        <li class="otheruser-message-style w-100 my-4">
          <img src="${msgs[i].User.avatar}" alt="">
            <div class="message-bubble">
              <strong>${msgs[i].User.name}</strong>

              <div class="message-text">${msgs[i].chatMessage}</div>
              <div class="time login-user-time">${new Date(msgs[i].createdAt).toLocaleTimeString('zh-TW', { timeZone: 'Asia/Taipei', hour: '2-digit', minute: '2-digit' })}</div>
            </div>
        </li>
        `
      }
      $('#messages').append(chatColumn);
    }
    $('#messages').scrollTop($('#messages')[0].scrollHeight - 50)
  })


  socket.on('notify', function () {
    notifyCounts++
    if (privateBadge.classList !== 'badge badge-danger') {
      privateBadge.classList.add('badge')
      privateBadge.classList.add('badge-danger')
    }
    privateBadge.innerText = notifyCounts
  })

  // socket.on("maxRecord", function (amount) {
  //   max_record = amount;
  // });


  // function rmMsgFromBox() {
  //   var childs = content.children;
  //   childs[0].remove();
  // }

});

function refrash() {
  let socket = io();
  let privateBadge = document.getElementById("private-badge")
  if (privateBadge.classList === "badge badge-danger") {
    privateBadge.classList.remove("badge")
    privateBadge.classList.remove("badge badge-danger")
  }
  notifyCounts = 0
  document.location.href = '/chat/private';
}

