module.exports = (socket) => {
  // 發給前端提醒聊天室
  socket.broadcast.emit('user connected', {
    id: socket.user_id,
    name: socket.name,
  })
  
}