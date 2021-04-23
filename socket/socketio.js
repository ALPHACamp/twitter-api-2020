const { UniqueConstraintError } = require('sequelize')
const { User, Message } = require('../models')


module.exports = (io) => {

  io.on('connection', (socket) => {

    socket.on('startChat', (user) => {
      Message.findAll({
        include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar', 'role'] }],
        order: [['createdAt', 'ASC']]
      })
        .then(historyMsg => {
          historyMsg = historyMsg.map(m => ({
            ...m.dataValues,
            messageOwner: '',
          }))
          //發送歷史訊息
          socket.emit('history', historyMsg)
          //通知所有人，有人上線
          socket.broadcast.emit('userOnline', `${user.name}上線`)
        })
    })



    //聊天訊息，將訊息存入資料庫
    socket.on('publicMessage', (msg) => {
      //如果使用者訊息為空就直接return
      if (msg.msg === '') return

      Message.create({
        UserId: msg.id,
        content: msg.content
      })
      User.findByPk(msg.id, { attributes: ['name', 'account', 'avatar'] })
        .then(user => {
          msg.name = user.name
          msg.avatar = user.avatar
          msg.account = user.account
          msg.messageOwner = ''
          msg.createdAt = new Date()

          io.emit('publicMessage', msg);
        })
    });


    socket.on("disconnect", () => {
      console.log("a user go out");
      // socket.broadcast.emit('user left', '使用者離開')
    });
  })
}


