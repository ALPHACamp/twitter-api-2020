document.addEventListener("DOMContentLoaded", () => {
  let socket = io();
  let sendForm = document.getElementById("send-form");
  let messages = document.getElementById("messages")
  let notify = document.getElementById("notify")

  $('#send-form').submit(function () {
    if ($('#text-input-area').val() !== '' && messages.innerText !== '') {
      let roomId = [$('#userId').val().toString(), $('#chatwithId').val().toString()].sort()
      let room = roomId[0] + roomId[1]
      console.log('send-client', room)
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

  socket.emit('join-me')

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

  socket.on('send private message', function (msg, avatar, name, id) {
    const event = new Date().toLocaleTimeString('zh-TW', { timeZone: 'Asia/Taipei', hour: '2-digit', minute: '2-digit' })
    let chatColumn = ``
    if ($('#userId').val() === id) {
      chatColumn = `
        <li class="loginuser-message-style">
          <img src="${avatar}" alt="">
            <div>
              <strong>${name}</strong>
              <p>${msg}</p>
              <span class="text-right" id='time'>${event}</span>
            </div>
        </li>
        `
    } else {
      chatColumn = `
        <li class="">
          <img src="${avatar}" alt="">
            <div>
              <strong>${name}</strong>
              <p>${msg}</p>
              <span class="text-right" id='time'>${event}</span>
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

  socket.on('notify', function (notice) {
    console.log(notice)
    notify.innerText = Number(notify.innerText) + 1
    console.log(notify.innerText)
  })

  socket.on("privateChatRecord", function (msgs, chatUserId) {
    messages.innerHTML = ''
    for (let i = 0; i < msgs.length; i++) {
      let chatColumn = `
          <li>
          <img src="${msgs[i].User.avatar}" alt="">
            <div>
              <strong>${msgs[i].User.name}</strong>
              <p>${msgs[i].message}</p>
              <span id='time'>${new Date(msgs[i].createdAt).toLocaleTimeString('zh-TW', { timeZone: 'Asia/Taipei', hour: '2-digit', minute: '2-digit' })}</span>
            </div>
        </li>
        `
      $('#messages').append(chatColumn);
      $('#messages').scrollTop($('#messages')[0].scrollHeight - 50)
    }

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
  let loginUserId = user.getAttribute('user-id');
  let chatUserId = user.getAttribute('data-id')
  let roomId = [loginUserId.toString(), chatUserId.toString()].sort()
  let room = roomId[0] + roomId[1]
  console.log('client', room)
  socket.emit('join-room', room)
  socket.emit('private-Record', loginUserId, chatUserId, room)
  //remove 上一個樣式

  //新增下一個樣式

}


