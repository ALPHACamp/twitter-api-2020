const messageService = require('../services/messageService')

const messageController = {
  getMessages: async (req, res) => {
    try {
      const data = await messageService.getMessages(req.query)

      return res.status(200).json(data)
    } catch (error) {
      return res.status(400).json({
        status: error.name,
        message: error.message
      })
    }
  },

  getChattedUsers: async (req, res) => {
    const id = Number(req.params.id)

    try {
      const data = await messageService.getChattedUsers(id)

      return res.status(200).json(data)
    } catch (error) {
      return res.status(400).json({
        status: error.name,
        message: error.message
      })
    }
  }
}

module.exports = messageController
