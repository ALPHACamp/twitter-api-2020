const { Member, Message, User } = require('../../models')
const messageService = require('../../services/messageService')

module.exports = (io, socket) => {
  // 監聽並提示有人進入公開聊天室
  socket.on('onlineHint', async user => {
    const profile = await User.findOne({
      raw: true,
      nest: true,
      where: { id: user.user.id },
      attributes: ['id', 'account', 'name', 'avatar']
    })
    const messages = await messageService.getMessages()
    io.emit('getChatHistory', messages)
    socket.broadcast.emit('onlineHint', `${profile.name}進入公開聊天室！`)
  })

  // 監聽訊息
  socket.on('getMessage', async message => {
    console.log('服務端 接收 訊息: ', message)
    await Member.findOrCreate({ where: { UserId: message.user.id, RoomId: 1 } })
    Message.create({
      content: message.content,
      UserId: message.user.id,
      roomId: 1,
      isRead: false
    }).then(message => {
      Message.findByPk(message.id, {
        include: [{ model: User, attributes: ['id', 'account', 'name', 'avatar'] }]
      }).then(message => {
        //回傳 message 給所有客戶端(包含自己)
        message['socketId'] = socket.id
        io.emit('getMessage', message)
      })
    })
  })

  //監聽並提示有人離開公開聊天室
  socket.on('offlineHint', async user => {
    const profile = await User.findOne({
      raw: true,
      nest: true,
      where: { id: user.user.id },
      attributes: ['id', 'account', 'name', 'avatar']
    })
    io.emit('offlineHint', `${profile.name}離開公開聊天室！`)
  })
}