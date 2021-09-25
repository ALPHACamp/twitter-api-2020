const socketService = require('../services/socketService.js')

const socketController = {
  getMessages: async (req, res, next) => {
    const { roomId } = req.params
    try {
      const messages = await socketService.getMessages(roomId)

      return res.status(200).json(messages)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = socketController
