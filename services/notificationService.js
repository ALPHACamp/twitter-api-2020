const db = require('../models')
const { NotifyLabel, Subscription, Notification, User } = db
const RequestError = require('../libs/RequestError')

const notificationService = {
  addNotification: async (senderId, content, notifyLabelName) => {
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

    const data = await Notification.bulkCreate(Array.from(subscribers, (subscriber, index) => ({
      receiverId: subscriber.subscriberId,
      senderId: senderId,
      content: content,
      NotifyLabelId: NotifyLabelId
    })))

    return data
  },
  getNotifications: async (id) => {
    const user = await User.findByPk(id)
    if (!user) {
      throw new RequestError('This user does not exist.')
    } else {
      return Notification.findAll({
        where: { receiverId: Number(id) },
        include: [
          { model: NotifyLabel, attributes: ['title'] },
          {
            model: User,
            attributes: ['id', 'name', 'avatar']
          }
        ],
        attributes: ['content', 'createdAt', 'isRead']
      }).then(notifications => {
        console.log(notifications)
        notifications = notifications.map((item, i) => {
          const mapItem = {
            ...item.dataValues,
            title: item.NotifyLabel.title,
            id: item.User.id,
            avatar: item.User.avatar,
            name: item.User.name,
            isRead: Boolean(item.dataValues.isRead)
          }
          delete mapItem.NotifyLabel
          delete mapItem.User

          return mapItem
        })
        return notifications
      })
    }
  }
}

module.exports = notificationService
