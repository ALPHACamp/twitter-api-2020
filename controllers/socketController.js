const socketService = require('../services/socketService.js')

const socketController = {
  getMessages: async (req, res, next) => {
    try {
      const messages = await socketService.getMessages()

      return res.status(200).json(messages)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = socketController
