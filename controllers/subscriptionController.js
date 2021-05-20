const db = require('../models')
const Subscription = db.Subscription
const User = db.User

const subscriptionController = {
  subscribeUser: async (req, res, next) => {
    try {
      const authorId = req.params.id
      const subscriberId = req.user.id

      // Users can not subscribe themselves
      if (Number(authorId) === subscriberId) {
        return res.status(403).json({
          status: 'error',
          message: 'You cannot subscribe yourself.'
        })
      }

      const [author, subscription] = await Promise.all([
        User.findByPk(authorId),
        Subscription.findOne({
          where: { authorId, subscriberId }
        })
      ])
      // Users can't subscribe the admin or the user that doesn't exist
      if (!author || author.role === 'admin') {
        return res.status(200).json({
          status: 'error',
          message: `cannot subscribe an user that doesn't exist`
        })
      }
      // Users can't subscribe the same user many times without cancelling subscription
      if (subscription) {
        return res.status(409).json({
          status: 'error',
          message: `already subscribed @${author.account}`
        })
      }

      await Subscription.create({
        subscriberId,
        authorId,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      return res.status(200).json({
        status: 'success',
        message: `subscribed @${author.account}`,
        author
      })
    } catch (error) {
      next(error)
    }
  },

  unsubscribeUser: async (req, res, next) => {
    try {
      const authorId = req.params.id
      const [author, subscription] = await Promise.all([
        User.findByPk(authorId),
        Subscription.findOne({
          where: { authorId, subscriberId: req.user.id }
        })
      ])

      // Users can't unsubscribe the user that doesn't exist
      if (!author) {
        return res.status(200).json({
          status: 'error',
          message: `cannot unsubscribe an user that doesn't exist`
        })
      }

      // Users can't unsubscribe the user if the subscription doesn't exist
      if (!subscription) {
        return res.status(200).json({
          status: 'error',
          message: `unable to cancel subscription since you haven't subscribed @${author.account} before`
        })
      }

      await subscription.destroy()
      return res.status(200).json({
        status: 'success',
        message: `Unsubscribe @${author.account}`,
        account: author.account
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = subscriptionController
