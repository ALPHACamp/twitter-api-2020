module.exports = (io) => {
  // 與前端溝通要傳的資料，a.直接是使用者物件
  const users = []
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userSocketId: id,
      user_id: socket.user_id,
      account: socket.account,
      name: socket.name,
      avatar: socket.avatar
    });
    console.log(users)

    socket.emit('users', users)
  }
}