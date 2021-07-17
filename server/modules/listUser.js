module.exports = (io, socket) => {
  // 與前端溝通要傳的資料，a.直接是使用者物件
  const users = []

  socket.on('current user', msg => {
    socket.data = { ...msg }

    for (let [id, socket] of io.of('/').sockets) {
      users.push({
        userSocketId: id,
        user_id: socket.data.user_id,
        account: socket.data.account,
        name: socket.data.name,
        avatar: socket.data.avatar
      })
    }

    socket.emit('users', users)
  })
}