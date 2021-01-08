const subscribeServices = require('../services/subscribeServices')

const subscribeController = {
  addSubscribing: (req, res) => {
    subscribeServices.addSubscribing(req, res, data => {
      if (data['status'] === 'success') {
        return res.json(data)
      }
    })
  },
  removeSubscribing: (req, res) => {
    subscribeServices.removeSubscribing(req, res, data => {
      if (data['status'] === 'success') {
        return res.json(data)
      }
    })
  },
  getNotifications: (req, res) => {
    subscribeServices.getNotifications(req, res, data => {
      return res.json(data)
    })
  }
}

module.exports = subscribeController
