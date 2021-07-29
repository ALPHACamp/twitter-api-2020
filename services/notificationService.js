const db = require('../models')
const { NotifyLabel, Subscription, Notification, User, Sequelize } = db
const { Op } = Sequelize
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
  },

  getNotifications: async (id) => {
    const user = await User.findByPk(id)
    if (!user) {
      throw new RequestError('This user does not exist.')
    }

    const notifications = await Notification.findAll({
      where: { receiverId: id },
      include: [
        { model: NotifyLabel, attributes: ['title'] },
        {
          model: User,
          attributes: ['id', 'name', 'avatar'],
          as: 'sender'
        }
      ],
      attributes: ['content', 'createdAt', 'isRead'],
      raw: true,
      nest: true,
      order: [['createdAt', 'DESC']]
    })

    const data = notifications.map((item, i) => {
      const mapItem = {
        ...item,
        title: item.NotifyLabel.title,
        id: item.sender.id,
        avatar: item.sender.avatar,
        name: item.sender.name,
        isRead: Boolean(item.isRead)
      }
      delete mapItem.NotifyLabel
      delete mapItem.sender

      return mapItem
    })
    return data
  },

  searchUnread: async (id) => {
    const count = await Notification.count({
      where: { receiverId: id, isRead: false }
    })

    return { unreadCount: count }
  },

  clearUnread: async (id) => {
    const data = await Notification.update({ isRead: true }, {
      where: {
        [Op.and]: [
          { receiverId: id },
          { isRead: false }
        ]
      }
    })

    return data
  }
}

module.exports = notificationService
