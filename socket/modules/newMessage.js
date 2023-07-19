const { emitError, findUserInPublic } = require('../helper')
const { Chat, User, Read, Room } = require('../../models')
const { Op } = require('sequelize')

module.exports = async socket => {
  try {
    console.log('Trigger new Message')
    // 確認使用者是否登入
    const currentUser = findUserInPublic(socket.id, 'socketId')
    console.log('User:', currentUser)
    // 找出目前登入的使用者所有的room
    const rooms = currentUser.rooms

    // 根據roomId去搜尋message，同一個roomId只留最新一筆訊息
    const message = await Chat.findAll({
      where: {
        roomId: { [Op.in]: rooms }
      },
      include: [
        { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
        {
          model: Room,
          attributes: ['id'],
          include: [
            {
              model: User,
              as: 'userOne',
              attributes: ['id', 'name', 'account', 'avatar']
            },
            {
              model: User,
              as: 'userTwo',
              attributes: ['id', 'name', 'account', 'avatar']
            }
          ]
        }
      ],
      attributes: ['message', 'roomId', 'timestamp'],
      order: [['id', 'DESC']]
    })
    // 找出該user所有的read data
    const reads = await Read.findAll({
      where: { userId: currentUser.id },
      attributes: ['roomId', 'lastRead'],
      raw: true
    })

    // 創一個obj用來計算未讀訊息數 -> { '2' : 0, '5' : 0 }， key 為 roomId
    const unread = rooms.reduce((acc, curr) => {
      acc[curr] = 0
      return acc
    }, {})

    const newMessage = []
    // 篩選最新消息，同時計算未讀訊息數量
    message.forEach(m => {
      // 確認此聊天室是否有read紀錄
      const isReadExist = reads.find(r => r.roomId === m.roomId)
      // 如果沒有紀錄，或是last read < timestamp
      if (!isReadExist || isReadExist?.lastRead < m.timestamp) {
        unread[m.roomId] += 1
      }
      const roomIdExist = newMessage.some(d => d.roomId === m.roomId)
      if (!roomIdExist) newMessage.push(m.toJSON())
    })

    // 計算所有未讀訊息總數
    let allUnreadMessageCounts = 0
    for (const c in unread) {
      allUnreadMessageCounts += unread[c]
    }
    // 將每個聊天室的未讀counts加入
    const newMessageData = newMessage.map(n => {
      // 整理targetUser
      if (n.Room.userOne.id.toString() === currentUser.id.toString()) {
        n.targetUser = n.Room.userTwo
        delete n.Room
      } else if (n.Room.userTwo.id.toString() === currentUser.id.toString()) {
        n.targetUser = n.Room.userOne
        delete n.Room
      }
      return {
        ...n,
        unreadMessageCounts: unread[n.roomId]
      }
    })

    // 回傳最新訊息&未讀總數 (只傳給socket本人)
    socket.emit('server-new-message', { newMessageData, allUnreadMessageCounts })
  } catch (err) {
    emitError(socket, err)
  }
}
