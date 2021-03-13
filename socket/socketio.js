const { User } = require('../models')


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


    socket.on('chat message', (msg) => {
      console.log('testmessage: ' + msg);
      io.emit('chat message', msg);
    });


    socket.on("disconnect", () => {
      console.log("a user go out");
    });
  })
}


