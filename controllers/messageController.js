const { Message, User } = require('../models')

const messageController = {
  sendMessage: async (req, res, next) => {
    try {
      await Message.create({
        senderId: req.user,
        receiverId: req.body.id,
        content: req.body.content,
        isPublic: req.body.isPublic
      })
      res.json({ status: 'success' })
    } catch (err) {
      console.log(err)
      next(err)
    }
  }
}

module.exports = messageController