const subscribeshipService = require('../services/subscribeshipService')

const subscribeshipController = {
  subscribeUser: (req, res) => {
    subscribeshipService.subscribeUser(req, res, data => res.status(data.status).json(data))
  },
  unSubscribeUser: (req, res) => {
    subscribeshipService.unSubscribeUser(req, res, data => res.status(data.status).json(data))
  }
}

module.exports = subscribeshipController