const notificationService = require('../services/notificationService')

const notificationController = {
  addNotification: async (req, res) => {
    try {
      const { id, content, labelName } = req.body
      const data = await notificationService.addNotification(id, content, labelName)

      return res.status(200).json(data)
    } catch (error) {
      console.error(error)
      return res.status(400).json({
        status: error.name,
        message: error.message
      })
    }
  }
}

module.exports = notificationController
