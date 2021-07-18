const { Chat, User, Member, Room, sequelize } = require('../models')

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
    const target = targetId ? `AND userId = ${targetId}` : ''
    return await await sequelize.query(
      `SELECT data.id As RoomId, data.name As RoomName, Users.id, Users.name, Users.avatar, CONCAT('@', Users.account) AS account FROM
      (SELECT Room.id, Room.name, COUNT(Members.id) OVER(partition by RoomId) AS people,
      Members.UserId AS userId,
      Members.createdAt AS MembersCreatedAt,
      Members.updatedAt AS MembersUpdatedAt FROM Rooms AS Room
      LEFT OUTER JOIN Members AS Members ON Room.id = Members.RoomId) AS data,
      Users
      WHERE UserId = Users.id AND (people = 2 AND userId != ${currentId} ${target})`,
      { type: sequelize.QueryTypes.SELECT }
    )
  },

  joinPrivateChat: async (currentId, targetId) => {
    if (!chatService.getPrivateChatList(currentId, targetId).length) {
      const room = await Room.create({
        name: `${currentId}+${targetId}`
      })

      await Member.bulkCreate([{ RoomId: room.id, UserId: currentId }, { RoomId: room.id, UserId: targetId }])
      return room.name
    }
    return 'room existed!'
  }
}

module.exports = chatService
