const db = require('../models')
const Message = db.Message
const User = db.User

const messageService = {
  getMessages: (req, res, callback) => {
    Message.findAll({
      limit: 20,
      order: [['createdAt', 'DESC']],
      include: [{ model: User }]
    }).then(messages => {
      return callback({ messages })
    })
  }
}

module.exports = messageService
