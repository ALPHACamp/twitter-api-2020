const { Message, Room, Member, User, Sequelize } = require('../models')
const { Op } = require('sequelize')
const {
  joiMessageHandler,
  messageSchema,
  memberSchema
} = require('../utils/validator')
const ApiError = require('../utils/customError')

const messageService = {
  postMessage: async (message) => {
    let { UserId, RoomId, content, isRead } = message
    message.isRead = isRead ? true : false
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

      if (!name) {
        throw new ApiError(
          'postPrivateRoomError',
          401,
          'The name cannot be blank'
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
      raw: true,
      nest: true,
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
    const member = { RoomId, targetUserId, currentUserId }
    // Check member format with Joi schema
    const { error } = memberSchema.validate(member, {
      abortEarly: false
    })

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
        where: {
          name: {
            [Op.or]: [
              { [Op.like]: `${currentUserId}-%` },
              { [Op.like]: `%-${currentUserId}` }
            ]
          }
        }
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
  },

  // FIXME: Directly through Sequlize, no further processing is required.
  getLatestMessages: async (currentUserId) => {
    const set = new Set()
    const messages = await Message.findAll({
      raw: true,
      nest: true,
      include: [
        {
          model: Room,
          attributes: [],
          where: {
            name: { [Op.substring]: currentUserId }
          },
          order: [['createdAt', 'DESC']]
        },
        {
          model: User,
          attributes: []
        }
      ],
      attributes: ['id', 'createdAt', 'content', 'RoomId'],
      group: ['id'],
      order: [['createdAt', 'DESC']]
    })

    const latestMessages = messages.filter((message) =>
      set.has(message.RoomId) ? false : set.add(message.RoomId)
    )

    return latestMessages
  }
}

module.exports = messageService
