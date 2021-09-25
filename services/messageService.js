const { Message, Room, Member, User, Sequelize } = require('../models')
const { Op } = require('sequelize')
const { joiMessageHandler, messageSchema } = require('../utils/validator')
const ApiError = require('../utils/customError')

const messageService = {
  postMessage: async (message) => {
    const { UserId, RoomId, content } = message

    // Check message format with Joi schema
    const { error } = messageSchema.validate(message, { abortEarly: false })

    // FIXME: I didn’t see the error correctly, but it was interrupted.
    if (error) {
      console.log(joiMessageHandler(error.details))
      throw new ApiError(
        'postTweetFormatError',
        400,
        joiMessageHandler(error.details)
      )
    }

    return await Message.create({
      UserId,
      RoomId,
      content
    })
  },

  getMessages: async (RoomId) => {
    console.log(typeof RoomId)
    return await Message.findAll({
      where: { RoomId },
      include: [
        { model: User, attributes: ['id', 'name', 'avatar', 'account'] }
      ],
      order: [['createdAt', 'ASC']]
    })
  },

  postPrivateRoom: async (targetUserId, currentUserId) => {
    const [privateRoom] = await messageService.getPrivateRooms(
      targetUserId,
      currentUserId
    )

    if (!privateRoom) {
      const name = `${currentUserId}-${targetUserId}`
      const room = await Room.create({ name })
      await messageService.postMember(room.id, targetUserId, currentUserId)
      return room
    }
    return privateRoom
  },

  getPrivateRooms: async (targetUserId, currentUserId) => {
    const queryOption = targetUserId
      ? { [Op.not]: currentUserId, [Op.eq]: targetUserId }
      : { [Op.not]: currentUserId }
    return await Member.findAll({
      where: {
        UserId: queryOption,
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

  postMember: async (RoomId, targetUserId, currentUserId) => {
    await Member.bulkCreate([
      { RoomId, UserId: currentUserId },
      { RoomId, UserId: targetUserId }
    ])

    return res.status(200).json({
      status: 'success',
      message: 'Members has created'
    })
  }
}

module.exports = messageService
