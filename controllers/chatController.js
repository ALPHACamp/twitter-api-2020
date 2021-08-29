const db = require('../models')
const { Message, User } = db
const chatController = {
  getHistoryMessage: async (req, res, next) => {
    try {
      let historyMessage = await Message.findAll({
        include: [User],
        order: [['createdAt', 'ASC']]
      })
      if (!historyMessage) {
        return res.status(404).json({ status: 'error', message: 'Cannot find any historyMessage in db.' })
      }
      historyMessage = historyMessage.map(message => {
        return {
          id: message.id,
          UserId: message.UserId,
          content: message.content,
          createdAt: message.createdAt,
          account: message.User.account,
          name: message.User.name,
          avatar: message.User.avatar
        }
      })
      return res.status(200).json(historyMessage)
    } catch (err) {
      next(err)
    }
  }
}
module.exports = chatController
