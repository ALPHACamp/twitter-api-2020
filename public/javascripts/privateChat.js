let notifyCounts = 0

document.addEventListener("DOMContentLoaded", () => {
  let socket = io();
  let sendForm = document.getElementById("send-form");
  let messages = document.getElementById("messages")
  let privateBadge = document.getElementById("private-badge")

  $('#send-form').submit(function () {
    if ($('#text-input-area').val() !== '' && messages.innerText !== '') {
      let roomId = [$('#userId').val().toString(), $('#chatwithId').val().toString()].sort()
      let room = roomId[0] + roomId[1]
      socket.emit('private chat message', $('#text-input-area').val(), $('#userId').val(), $('#userAvatar').val(), $('#userName').val(), $('#chatwithId').val(), room)
      $('#text-input-area').val('')
    } else if (messages.innerText == '') {
      console.log('please choos the user!')
    } else {
      sendForm.childNodes[3].classList.add("wrong");
      sendForm.childNodes[3].addEventListener('animationend', event => event.target.classList.remove('wrong'), { once: true })
    }
    return false;
  });

  socket.emit('join-me', $('#userId').val())

  socket.on('send private message', function (msg, avatar, name, id) {
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

  socket.on('notify', function () {
    notifyCounts++
    if (privateBadge.classList !== "badge badge-danger") {
      privateBadge.classList.add("badge")
      privateBadge.classList.add("badge-danger")
    }
    console.log(privateBadge.classList)
    privateBadge.innerText = notifyCounts
    console.log(notifyCounts)
  })

  socket.on("privateChatRecord", function (msgs, chatUserId, loginUserId) {
    messages.innerHTML = ''
    for (let i = 0; i < msgs.length; i++) {
      if (Number(loginUserId) === Number(msgs[i].User.id)) {
        let chatColumn = `
        <li class="loginuser-message-style w-100 my-4">
          <img src="${msgs[i].User.avatar}" alt="">
            <div id="message-bubble">
              <strong>${msgs[i].User.name}</strong>
              <p class="message-text py-1">${msgs[i].message}</p>
              <div id='time' class="text-right login-user-time">${new Date(msgs[i].createdAt).toLocaleTimeString('zh-TW', { timeZone: 'Asia/Taipei', hour: '2-digit', minute: '2-digit' })}</div>
            </div>
        </li>
        `
        $('#messages').append(chatColumn);
      } else {
        let chatColumn = `
        <li class="otheruser-message-style w-100 my-4">
          <img src="${msgs[i].User.avatar}" alt="">
            <div id="message-bubble">
              <strong>${msgs[i].User.name}</strong>
              <p class="message-text">${msgs[i].message}</p>
              <div id='time' class="text-right other-user-time">${new Date(msgs[i].createdAt).toLocaleTimeString('zh-TW', { timeZone: 'Asia/Taipei', hour: '2-digit', minute: '2-digit' })}</div>
            </div>
        </li>
        `
        $('#messages').append(chatColumn);
      }
    }
    $('#messages').scrollTop($('#messages')[0].scrollHeight - 50)

    let chatWith = `
         <input id='chatwithId' type="hidden" name="userId" value=${chatUserId}>
        `
    if (typeof sendForm.children[4] !== 'undefined') {
      sendForm.removeChild(sendForm.children[4])
    }
    $('#send-form').append(chatWith)
  })

  // socket.on("maxRecord", function (amount) {
  //   max_record = amount;
  // });


  // function rmMsgFromBox() {
  //   var childs = content.children;
  //   childs[0].remove();
  // }
});

function showChatHistory(user) {
  let socket = io();
  let chatwithName = document.getElementById("chatwithName")
  let chatwithAccount = document.getElementById("chatwithAccount")
  let loginUserId = user.getAttribute('user-id');
  let chatUserId = user.getAttribute('data-id')
  let chatUserName = user.getAttribute('data-name')
  let chatUserAccont = user.getAttribute('data-account')
  let roomId = [loginUserId.toString(), chatUserId.toString()].sort()
  let room = roomId[0] + roomId[1]
  socket.emit('join-room', room)
  socket.emit('private-Record', loginUserId, chatUserId, room)

  chatwithName.innerText = chatUserName
  chatwithAccount.innerText = `@${chatUserAccont}`

  //remove 上一個樣式

  //新增下一個樣式

}

function refrash() {
  let socket = io();
  let privateBadge = document.getElementById("private-badge")
  if (privateBadge.classList === "badge badge-danger") {
    privateBadge.classList.remove("badge")
    privateBadge.classList.remove("badge-danger")
  }
  notifyCounts = 0
  document.location.href = '/chat/private';
}


