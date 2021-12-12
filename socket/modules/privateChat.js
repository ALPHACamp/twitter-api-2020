const { Member, Message, User, Room } = require('../../models')
const messageService = require('../../services/messageService')

module.exports = (io, socket) => {
  // 監聽並提示有人進入私人聊天室
  socket.on('enterRoom', async user => {
    const profile = await User.findOne({
      raw: true,
      nest: true,
      where: { id: user.user2.id },
      attributes: ['id', 'account', 'name', 'avatar']
    })
    const roomsFor1 = await Member.findAll({ raw: true, nest: true, where: { UserId: user.user1.id } })
    const roomsFor2 = await Member.findAll({ raw: true, nest: true, where: { UserId: user.user2.id } })

    let room = null
    if (roomsFor1 && roomsFor2) {
      for (let i = 0; i < roomsFor1.length; i++) {
        for (let j = 0; j < roomsFor2.length; j++) {
          roomsFor1[i].RoomId === roomsFor2[j].RoomId ? (room = roomsFor1[i].RoomId) : (room = null)
        }
      }
      socket.join(room)
    }

    if (!room) {
      const newRoom = await Room.create({ name: `user${user.user1.id}&user${user.user2.id}的聊天室` })
      await Member.create({ UserId: user.user1.id, RoomId: newRoom.id })
      await Member.create({ UserId: user.user2.id, RoomId: newRoom.id })
      socket.join(newRoom.id)
    }
    socket.emit('enterRoom', `和 ${profile.name}開啟私訊對話！`)
  })


  // 監聽訊息
  socket.on('privateMessage', data => {
    console.log('服務端 接收 訊息: ', data)
    // Message.create({
    //   content: data.text,
    //   UserId: data.UserId
    // }).then(message => {
    //   Message.findByPk(message.id, {
    //     include: [User]
    //   }).then(message => {
    //     //回傳 message 給所有客戶端(包含自己)
    //     privateNamespace.emit('getMessage', message)
    //   })
    // })
  })

  // 監聽並提示有人離開私人聊天室
  socket.on('leaveRoom', userName => {
    socket.emit('leaveRoom', userName)
  })
}
