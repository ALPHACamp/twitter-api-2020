const notificationService = require('../services/notificationService')

const notificationController = {
  addNotification: async (req, res) => {
    try {
      const { senderId, content, notifyLabelName } = req.body
      const data = await notificationService.addNotification(senderId, content, notifyLabelName)

      return res.status(200).json(data)
    } catch (error) {
      return res.status(400).json({
        status: error.name,
        message: error.message
      })
    }
  },
  getNotifications: async (req, res) => {
    try {
      const { id } = req.params

      const data = await notificationService.getNotifications(Number(id))

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
