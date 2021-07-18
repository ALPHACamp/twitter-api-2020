const { Chat, User, Member, Room, Sequelize } = require('../models')
const { Op } = Sequelize

const chatService = {
  getHistoryChat: async (roomId = null) => {
    return await Chat.findAll({
      attributes: ['id', 'text', 'createdAt'],
      where: { RoomId: roomId },
      include: [
        { model: User, attributes: ['id', 'name', 'avatar'] }
      ],
      order: [['createdAt', 'DESC']]
    })
  },

  postChat: async (chatData) => {
    try {
      return await Chat.create(chatData)
    } catch (error) {
      return error.message
    }
  },

  getPrivateChatList: async (currentId, targetId = null) => {
    const options = targetId ? { [Op.not]: currentId, [Op.eq]: targetId } : { [Op.not]: currentId }
    return await Member.findAll({
      attributes: ['id'],
      where: {
        UserId: options,
        RoomId: [Sequelize.literal(`SELECT RoomId FROM Members WHERE UserId = ${currentId}`)]
      },
      include: [
        { model: Room, attributes: ['id', 'name'] },
        {
          model: User,
          attributes: [
            'id', 'avatar', 'name',
            [Sequelize.fn('concat', '@', Sequelize.col('User.account')), 'account']
          ]
        }
      ]
    })
  },

  joinPrivateChat: async (currentId, targetId) => {
    const [privateChat] = await chatService.getPrivateChatList(currentId, targetId)
    if (!privateChat) {
      const room = await Room.create({
        name: `${currentId}+${targetId}`
      })

      await Member.bulkCreate([{ RoomId: room.id, UserId: currentId }, { RoomId: room.id, UserId: targetId }])
      return room.toJSON()
    }
    return privateChat.Room
  }
}

module.exports = chatService
