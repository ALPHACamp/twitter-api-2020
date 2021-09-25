const { Message, Room, Member, User, Sequelize } = require('../models')
const { Op } = require('sequelize')
const {
  joiMessageHandler,
  messageSchema,
  memberSchema,
  roomSchema
} = require('../utils/validator')
const ApiError = require('../utils/customError')

const messageService = {
  postMessage: async (message) => {
    let { UserId, RoomId, content, isRead } = message
    isRead ? true : false
    // Check message format with Joi schema
    const { error } = messageSchema.validate(message, { abortEarly: false })

    if (error) {
      throw new ApiError(
        'postMessageError',
        401,
        joiMessageHandler(error.details)
      )
    }

    return await Message.create({
      UserId,
      RoomId,
      content,
      isRead
    })
  },

  getMessages: async (RoomId) => {
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
      // Check room format with Joi schema
      const { error } = roomSchema.validate(name, { abortEarly: false })

      if (error) {
        throw new ApiError(
          'postPrivateRoomError',
          401,
          joiMessageHandler(error.details)
        )
      }

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
        {
          model: User,
          attributes: ['id', 'avatar', 'name', 'account']
        },
        { model: Room, attributes: ['id', 'name'] }
      ]
    })
  },

  postMember: async (RoomId, targetUserId, currentUserId) => {
    // Check member format with Joi schema
    const { error } = memberSchema.validate(
      targetUserId,
      currentUserId,
      RoomId,
      {
        abortEarly: false
      }
    )

    if (error) {
      throw new ApiError(
        'postMemberError',
        401,
        joiMessageHandler(error.details)
      )
    }
    await Member.bulkCreate([
      { RoomId, UserId: currentUserId },
      { RoomId, UserId: targetUserId }
    ])
  },

  getPrivateUnreadMessageCount: async (currentUserId) => {
    return await Message.count({
      include: {
        model: Room,
        attributes: [],
        where: { name: { [Op.substring]: currentUserId } }
      },
      where: {
        UserId: { [Op.not]: currentUserId },
        isRead: false
      }
    })
  },

  putMessageIsReadStatus: async (RoomId, currentUserId) => {
    if (!RoomId) {
      throw new ApiError(
        'getUnreadMessageCountError',
        401,
        'The RoomId cannot be blank'
      )
    }
    return await Message.update(
      { isRead: true },
      {
        where: { UserId: { [Op.not]: currentUserId }, RoomId }
      }
    )
  }
}

module.exports = messageService
