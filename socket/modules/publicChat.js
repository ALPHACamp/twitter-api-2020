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
    socket.emit('getChatHistory', messages)
    socket.broadcast.emit('onlineHint', profile)

    // 將 user 登入狀態寫進 DB
    const [member, created] = await Member.findOrCreate({ where: { UserId: user.user.id, RoomId: 1 } })
    await member.update({ online: true })
    // 再回傳正在聊天室裡的 member array
    const members = await Member.findAll({
      raw: true,
      nest: true,
      where: { online: true },
      include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar'] }],
      order: [['updatedAt', 'ASC']]
    })
    io.emit('onlineMember', members)
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
    io.emit('offlineHint', profile)
    // 將 user 登入狀態從 DB 移除
    const member = await Member.findOne({ where: { UserId: user.user.id, RoomId: 1 } })
    await member.update({ online: false })
    // 再回傳正在聊天室裡的 member array
    const members = await Member.findAll({
      raw: true,
      nest: true,
      where: { online: true },
      include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar'] }],
      order: [['updatedAt', 'ASC']]
    })
    io.emit('onlineMember', members)
  })
}