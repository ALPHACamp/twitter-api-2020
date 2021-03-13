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

    //廣播
    // socket.emit("allMessage", fakeHistoryMsg)

    socket.on('startChat', (user) => {
      console.log(user)
      Message.findAll({
        include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar', 'role'] }],
        order: [['createdAt', 'ASC']]
      })
        .then(historyMsg => {
          historyMsg = historyMsg.map(m => ({
            ...m.toJSON()
          }))
          //發送歷史訊息
          socket.emit('history', historyMsg)
          //通知所有人，有人上線
          // socket.broadcast.emit('userOnline', `${username}上線`)

        })
    })



    //聊天訊息，將訊息存入資料庫
    socket.on('publicMessage', (msg) => {
      console.log(msg)
      Message.create({
        UserId: msg.id, //暫時設假數字，等前端傳來再改
        content: msg.msg
      })
      // console.log('testmessage: ' + msg);
      io.emit('publicMessage', msg);
    });



    socket.on("disconnect", () => {
      console.log("a user go out");

      // socket.broadcast.emit('user left',)
    });
  })
}


