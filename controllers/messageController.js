const messageService = require('../services/messageService')
const ApiError = require('../utils/customError')
const helpers = require('../_helpers')

const messageController = {
  // publicRoom RoomID can be null or defaultValue
  // privateRoom need have RoomID
  getMessages: async (req, res, next) => {
    try {
      const RoomId = req.params.RoomId

      if (!RoomId) {
        throw new ApiError(
          'getMessagesError',
          401,
          'The RoomId cannot be blank'
        )
      }
      const messages = await messageService.getMessages(RoomId)
      return res.status(200).json(messages)
    } catch (error) {
      next(error)
    }
  },

  getPrivateRooms: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id

      if (!currentUserId) {
        throw new ApiError(
          'getPrivateRoomsError',
          401,
          'The currentUserId cannot be blank'
        )
      }
      const rooms = await messageService.getPrivateRooms(null, currentUserId)
      return res.status(200).json(rooms)
    } catch (error) {
      next(error)
    }
  },

  getLatestMessages: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id

      if (!currentUserId) {
        throw new ApiError(
          'getLatestMessageError',
          401,
          'The currentUserId cannot be blank'
        )
      }
      const rooms = await messageService.getPrivateRooms(null, currentUserId)
      const latestMessages = await messageService.getLatestMessages(
        currentUserId
      )

      rooms.forEach((room) => {
        latestMessages.forEach((message) => {
          if (room.RoomId === message.RoomId) {
            room.content = message.content
            room.createdAt = message.createdAt
          }
        })
      })

      return res.status(200).json(rooms)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = messageController
