const messageService = require('../services/messageService')
const ApiError = require('../utils/customError')

const messageController = {
  // publicRoom RoomID can be null or defaultValue
  // privateRoom need have RoomID
  getMessages: async (req, res, next) => {
    try {
      const { RoomId } = req.params.RoomId
      const messages = await messageService.getMessages(RoomId)
      return res.status(200).json(messages)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = messageController
