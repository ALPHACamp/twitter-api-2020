const chatServices = require('../services/charServices')

const chatController = {
  getChatRoom: (req, res) => {
    chatServices.getChatRoom(req, res, data => {
      return res.json(data)
    })
  }
}

module.exports = chatController