const db = require('../models')
const Subscribe = db.Subscribe
const Notification = db.Notification
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
      where: {
        recipientId: UserID
      }
    }).then((notifications) => {
      callback(notifications)
    })
  }
}

module.exports = subscribeServices
