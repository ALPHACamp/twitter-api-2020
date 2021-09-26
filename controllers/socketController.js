const socketService = require('../services/socketService.js')
const helpers = require('../_helpers')

const socketController = {
  getMessages: async (req, res, next) => {
    const { roomId } = req.params
    try {
      const messages = await socketService.getMessages(roomId)

      return res.status(200).json(messages)
    } catch (error) {
      next(error)
    }
  },
  getPrivateMessages: async (req, res, next) => {
    const userId = helpers.getUser(req).id
    try {
      const result = await socketService.getPrivateMessages(userId)

      return res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = socketController
