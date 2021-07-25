const notificationService = require('../services/notificationService')

const notificationController = {
  addNotification: async (req, res) => {
    try {
      const { senderId } = req.body
      const data = await notificationService.addNotification()

      return res.status(200).json(data)
    } catch (error) {
      return res.status(400).json({
        status: error.name,
        message: error.message
      })
    }
  }
}

module.exports = notificationController
