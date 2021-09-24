const { Message, Room, Member, User } = require('../models')

const messageService = {
  postMessage: async (message) => {
    const { UserId, RoomId, content } = message
    return await Message.create({
      UserId,
      RoomId,
      content
    })
  },

  getMessages: async (room) => {
    const { RoomId } = room
    return await Message.findAll({
      where: { RoomId },
      include: [
        { model: User, attributes: ['id', 'name', 'avatar', 'account'] }
      ],
      order: [['createdAt', 'ASC']]
    })
  },

  postPrivateRoom: async (targetUserId, currentUserId) => {
    const name = `${currentUserId}-${targetUserId}`
    return await Room.create({ name })
  },

  getPrivateRooms: async (targetUserId, currentUserId) => {
    return await Member.findAll({
      where: {
        UserId: targetUserId,
        RoomId: [
          Sequelize.literal(
            `SELECT RoomId FROM Members WHERE UserId = ${currentUserId}`
          )
        ]
      },
      include: [
        { model: Room, attributes: ['id', 'name'] },
        {
          model: User,
          attributes: [
            'id',
            'avatar',
            'name',
            [
              Sequelize.fn('concat', '@', Sequelize.col('User.account')),
              'account'
            ]
          ]
        }
      ]
    })
  },

  postMember: async (room, targetUserId, currentUserId) => {
    const { RoomId } = room
    await Member.bulkCreate([
      { RoomId, UserId: currentUserId },
      { RoomId, UserId: targetUserId }
    ])

    return res.status(200).json({
      status: 'success',
      message: 'A member has created'
    })
  }
}

module.exports = messageService
