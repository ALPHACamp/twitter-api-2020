const { UniqueConstraintError } = require('sequelize')
const { User, Message } = require('../models')


module.exports = (io) => {

  io.on('connection', (socket) => {

    console.log('user connected')

    //廣播
    // socket.emit("allMessage", fakeHistoryMsg)

    socket.on('startChat', (user) => {
      console.log('user', user)
      //通知所有人，有人上線
      socket.broadcast.emit('userOnline', `${user.name}上線`)

      Message.findAll({
        include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar', 'role'] }],
        order: [['createdAt', 'ASC']]
      })
        .then(historyMsg => {
          historyMsg = historyMsg.map(m => ({
            ...m.toJSON()
          }))
          // console.log('historyMsg', historyMsg)
          //發送歷史訊息
          socket.emit('history', historyMsg)


        })
    })



    //聊天訊息，將訊息存入資料庫
    socket.on('publicMessage', (msg) => {
      console.log(msg)
      Message.create({
        UserId: msg.id,
        content: msg.msg
      })
      User.findByPk(msg.id, { attributes: ['name', 'account', 'avatar'] })
        .then(user => {

          msg.name = user.name
          msg.avatar = user.avatar
          msg.account = user.account
          msg.messageOwner = ''

          io.emit('publicMessage', msg);
        })
    });



    socket.on("disconnect", () => {
      console.log("a user go out");

      // socket.broadcast.emit('user left',)
    });
  })
}


