$(function () {
  let socket = io();
  let status = document.getElementById("status");
  let online = document.getElementById("online");
  let userSide = document.getElementById("users");
  let sendForm = document.getElementById("send-form").childNodes[1];
  let userInfo = document.getElementById("userInfo")

  socket.emit('login', userInfo.innerText)

  $('form').submit(function () {
    if ($('#m').val() !== '') {
      socket.emit('chat message', $('#m').val(), $('#userAvatar').val(), $('#userName').val())
      $('#m').val('')
    } else {
      sendForm.classList.add("wrong");
      sendForm.addEventListener('animationend', event => event.target.classList.remove('wrong'), { once: true })
    }
    return false;
  });

  socket.on("connect", function () {
    status.classList.remove("disconnected")
    status.innerText = `Connected`;
    status.classList.add("connected")
  });

  socket.on("disconnect", function () {
    status.classList.add("connected")
    status.innerText = `Disconnected`;
    status.classList.add("disconnected")
  });

  socket.on("online", function (amount, userlist) {
    online.innerText = amount;
    let userlistColumn = ``
    for (i = 0; i < userlist.length; i++) {
      userlistColumn += `
        <li>
          <img src="${userlist[i].avatar}" alt="">
            <strong>${userlist[i].name}</strong>
            <strong id="user-account">${userlist[i].account}</strong>
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
  })

  socket.on("oneLeave", function (user) {
    let userMsg = `
          <li>
          <span>${user} 離線。</span>
          </li>
          `
    $('#messages').append(userMsg);
  })

  socket.on('chat message', function (msg, name, avatar) {
    const event = new Date().toLocaleTimeString('zh-TW', { timeZone: 'Asia/Taipei', hour: '2-digit', minute: '2-digit' })
    let chatColumn = `
          <li>
          <img src="${avatar}" alt="">
            <div>
              <strong>${name}</strong>
              <p>${msg}</p>
              <span id='time'>${event}</span>
            </div>
        </li>
        `
    $('#messages').append(chatColumn);
    $('#content').scrollTop($('#content')[0].scrollHeight - 50)
  });
});