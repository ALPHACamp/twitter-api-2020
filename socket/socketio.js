const { User, Message } = require('../models')


module.exports = (io) => {
  const fakeHistoryMsg = [
    {
      name: "stan",
      message: "打給賀"
    }
  ]

  io.on('connection', (socket) => {

    console.log('user connected')
    //需建立user
    //需有監聽誰進房間後的登入訊息  

    //廣播
    socket.emit("allMessage", fakeHistoryMsg)

    socket.on('joinRoom', (msg) => {

    })

    //聊天訊息，將訊息存入資料庫
    socket.on('chat message', (msg) => {
      console.log(msg)
      Message.create({
        UserId: 1, //暫時設假數字，等前端傳來再改
        content: msg
      })
      console.log('testmessage: ' + msg);
      io.emit('chat message', msg);
    });


    socket.on("disconnect", () => {
      console.log("a user go out");
    });
  })
}


