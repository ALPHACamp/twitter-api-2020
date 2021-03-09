// 加入線上人數計數


module.exports = (io) => {
  // 計算上線人數
  let onlineCount = 0
  
  io.on('connection', async (socket) => {
    console.log('user connection')

    // 發送連線人數給網頁
    onlineCount++;
    io.emit("online", onlineCount)

    // 監聽
    socket.on("send", async (msg) => {
      console.log('監聽前端使用者訊息', msg)
      // 如果 msg 內容鍵值小於 2 等於是訊息傳送不完全
      // 因此我們直接 return ，終止函式執行。
      if (Object.keys(msg).length < 2) return;
      io.emit("msg", msg)
      // await Message.create({
      //   name: msg.name,
      //   msg: msg.msg,
      //   time: msg.time
      // }).then(user => {
      //   const data = {
      //     time: user.dataValues.time,
      //     name: user.dataValues.name,
      //     msg: user.dataValues.msg
      //   }
      //   io.emit("msg", data)
      // })
  
    })

    // 離線
    socket.on('disconnect', () => {
      onlineCount = (onlineCount < 0) ? 0 : onlineCount -= 1
      io.emit("online", onlineCount)
    })

  })
}