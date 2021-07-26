const db = require('../models')
const { NotifyLabel, Subscription, Notification } = db
const RequestError = require('../libs/RequestError')

const notificationService = {
  addNotification: async (senderId, content, notifyLabelName, receiverId = null) => {
    let data = ''
    const [NotifyLabelId, subscribers] = await Promise.all([
      NotifyLabel.findOne({
        where: {
          labelName: notifyLabelName
        },
        attributes: ['id'],
        raw: true
      }),
      Subscription.findAll({
        where: {
          recipientId: senderId
        },
        attributes: ['subscriberId'],
        raw: true
      })
    ])

    if (!NotifyLabelId) {
      throw new RequestError(`notifyLabelName: ${notifyLabelName} isn't exist in DB`)
    }

    if (subscribers.length === 0) {
      throw new RequestError('This sender does not have any subscriber.')
    }

    if (receiverId) {
      data = await Notification.create({
        receiverId: receiverId,
        senderId: senderId,
        content: content,
        NotifyLabelId: NotifyLabelId.id
      })
    } else {
      data = await Notification.bulkCreate(Array.from(subscribers, (subscriber, index) => ({
        receiverId: subscriber.subscriberId,
        senderId: senderId,
        content: content,
        NotifyLabelId: NotifyLabelId.id
      })))
    }

    return data
  }
}

module.exports = notificationService
