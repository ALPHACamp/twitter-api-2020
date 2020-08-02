// alert auto dismiss
window.setTimeout(function () {
  $(".alert").alert('close')
}, 3000);

document.addEventListener("DOMContentLoaded", () => {
  let socket = io();
  let status = document.getElementById("status");
  let online = document.getElementById("online");
  let userSide = document.getElementById("users");
  let sendForm = document.getElementById("send-form").childNodes[1];
  let userInfo = document.getElementById("userInfo")

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
          <span>${user} 上線。</span>
          </li>
          `
    $('#messages').append(userMsg);
    $('#messages').scrollTop($('#messages')[0].scrollHeight - 50)
  })

  socket.on("oneLeave", function (user) {
    let userMsg = `
          <li>
          <span>${user} 離線。</span>
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
        <li class="loginuser-message-style w-100 my-4">
            <div id="message-bubble">
              <p class="message-text py-1">${msg}</p>
              <div class="text-right login-user-time" id='time'>${event}</div>
            </div>
        </li>
        `
    } else {
      chatColumn = `
        <li class="otheruser-message-style w-100 my-4">
          <img src="${avatar}" alt="">
            <div id="message-bubble">
              <p class="message-text">${msg}</p>
              <div class="text-right other-user-time" id='time'>${event}</div>
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

  socket.on("chatRecord", function (msgs) {
    for (let i = 0; i < msgs.length; i++) {
      let chatColumn = `
        <li class="my-4">
          <img src="${msgs[i].User.avatar}" alt="">
            <div id="message-bubble">
              <strong>${msgs[i].User.name}</strong>
              <p class="message-text">${msgs[i].chatMessage}</p>
              <div id='time' class="login-user-time">${new Date(msgs[i].createdAt).toLocaleTimeString('zh-TW', { timeZone: 'Asia/Taipei', hour: '2-digit', minute: '2-digit' })}</div>
            </div>
        </li>
        `
      $('#messages').append(chatColumn);
      $('#messages').scrollTop($('#messages')[0].scrollHeight - 50)
    }
  })

  // socket.on("maxRecord", function (amount) {
  //   max_record = amount;
  // });


  // function rmMsgFromBox() {
  //   var childs = content.children;
  //   childs[0].remove();
  // }

});

