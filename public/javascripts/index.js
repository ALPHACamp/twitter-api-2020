const socket = io();

const messages = document.querySelector('#messagesBody');
const form = document.querySelector('#form');
const input = document.querySelector('#message');

socket.name = 'user1'
form.addEventListener('submit', function (e) {
  e.preventDefault();
  if (input.value) {
    socket.name = 'user1'
    socket.emit('chat message', { name: `${socket.name}`, msg: `${input.value}` });
    input.value = '';
  }
});

socket.on('chat message', (msg) => {
  const item = document.createElement('li');
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);