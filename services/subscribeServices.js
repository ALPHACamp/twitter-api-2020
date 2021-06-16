const db = require('../models')
const Subscribe = db.Subscribe
const Notification = db.Notification
const User = db.User
const helpers = require('../_helpers')

const subscribeServices = {
  addSubscribing: (req, res, callback) => {
    const UserID = helpers.getUser(req).id
    return Subscribe.create({
      subscriberId: UserID,
      subscribingId: req.body.id
    }).then(subscribe => {
      callback({ status: 'success', message: 'Subscribe!!!!' })
    })
  },
  removeSubscribing: (req, res, callback) => {
    const UserID = helpers.getUser(req).id
    return Subscribe.findOne({
      where: {
        subscriberId: UserID,
        subscribingId: req.params.subscribingId
      }
    }).then((subscribe) => {
      subscribe.destroy()
        .then(subscribe => {
          callback({ status: 'success', message: 'unsubscribe!!!!!' })
        })
    })
  },
  getNotifications: (req, res, callback) => {
    const UserID = helpers.getUser(req).id
    Notification.findAll({
      include: [User],
      where: {
        recipientId: UserID
      }
    }).then((notifications) => {
      notifications = notifications.map(noti => ({
        ...noti.dataValues,
        avatar: noti.User.avatar
      }))
      notifications.forEach(noti => {
        delete noti.User
      })
      return callback(notifications)
    })
  },
  readNotifications: (req, res, callback) => {
    const USERId = req.body.id
    Notification.update({ isRead: true }, { where: { recipientId: USERId } })
      .then(() => {
        return callback({ status: 'success', message: 'notifications was successfully to read' })
      })
  }
}

module.exports = subscribeServices
