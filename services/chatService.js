const { Chat, User, sequelize } = require('../models')

const chatService = {
  joinPublicChat: async (roomId = null) => {
    return await Chat.findAll({
      attributes: ['id', 'text', 'createdAt'],
      where: { room: roomId },
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

  getPrivateChatList: async (currentId) => {
    return await await sequelize.query(
      `SELECT data.id As RoomId, data.name As RoomName, Users.id, Users.name, Users.avatar FROM
      (SELECT Room.id, Room.name, COUNT(Members.id) OVER(partition by RoomId) AS people,
      Members.UserId AS userId,
      Members.createdAt AS MembersCreatedAt,
      Members.updatedAt AS MembersUpdatedAt FROM Rooms AS Room
      LEFT OUTER JOIN Members AS Members ON Room.id = Members.RoomId) AS data,
      Users
      WHERE UserId = Users.id AND (people = 2 AND userId != ${currentId})`,
      { type: sequelize.QueryTypes.SELECT }
    )
  }
}

module.exports = chatService
