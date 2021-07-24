const db = require('../models')
const { User, Subscription, Sequelize } = db
const { Op } = Sequelize
const RequestError = require('../libs/RequestError')

const subscriptionService = {
  addSubscription: (recipientId, subscriberId) => {
    if (!recipientId) {
      throw new RequestError('RecipientId required.')
    }
    if (!subscriberId) {
      throw new RequestError('SubscriberId required.')
    }
    if (recipientId === subscriberId) {
      throw new RequestError('You cannot subscribe yourself.')
    }

    return Subscription.findOne({
      where: {
        [Op.and]: [
          { recipientId },
          { subscriberId }
        ]
      }
    }).then(subscription => {
      if (subscription) {
        throw new RequestError('You have already subscribed this user.')
      }

      Promise.all([
        User.findByPk(recipientId),
        User.findByPk(subscriberId)
      ]).then(users => {
        if (!users[0]) {
          throw new RequestError('RecipientId may be wrong.')
        }
        if (!users[1]) {
          throw new RequestError('SubscriberId may be wrong.')
        }

        return Subscription.create({ recipientId, subscriberId, groupName: `Channel${recipientId}` })
      })
    })
  },
  removeSubscription: (recipientId, subscriberId) => {
    if (!recipientId) {
      throw new RequestError('RecipientId required.')
    }
    if (!subscriberId) {
      throw new RequestError('SubscriberId required.')
    }

    Promise.all([
      User.findByPk(recipientId),
      User.findByPk(subscriberId)
    ]).then(users => {
      if (!users[0]) {
        throw new RequestError('RecipientId may be wrong.')
      }
      if (!users[1]) {
        throw new RequestError('SubscriberId may be wrong.')
      }

      return Subscription.findOne({
        where: {
          [Op.and]: [
            { recipientId },
            { subscriberId }
          ]
        }
      }).then(result => {
        if (!result) {
          throw new RequestError('Cannot cancel subscription since you haven\'t subscribed this user before.')
        } else {
          result.destroy()
          return result
        }
      })
    })
  }
}

module.exports = subscriptionService
