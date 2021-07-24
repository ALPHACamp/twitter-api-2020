const subscriptionService = require('../services/subscriptionService')

const subscriptionController = {
  addSubscription: async (req, res) => {
    try {
      const { recipientId, subscriberId } = req.query

      await subscriptionService.addSubscription(recipientId, subscriberId)

      return res.status(200).json({
        status: 'success',
        message: 'Subscribed successfully.'
      })
    } catch (error) {
      return res.status(400).json({
        status: error.name,
        message: error.message
      })
    }
  }
}

module.exports = subscriptionController
