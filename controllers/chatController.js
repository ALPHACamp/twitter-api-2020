const chatServices = require('../services/charServices')

const chatController = {
  postChatRoom: (req, res) => {
    chatServices.postChatRoom(req, res, data => {
      return res.json(data)
    })
  },
  deleteChatRoom: (req, res) => {
    chatServices.deleteChatRoom(req, res, data => {
      return res.json(data)
    })
  },
  getChatRoom: (req, res) => {
    chatServices.getChatRoom(req, res, data => {
      return res.json(data)
    })
  }
}

module.exports = chatController