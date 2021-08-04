const { User, Message } = require('../models')
const { Op } = require('sequelize')
const publicRoomId = '5'

let chatController = {
  getHistoryMessage: async (req, res, next) => {
    try {
      let historyMessage = await Message.findAll({
        where: { chatRoomId: publicRoomId },
        attributes: ['message', 'createdAt'],
        include: { model: User, attributes: ['id', 'name', 'avatar', 'account'] },
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']]
      })
      if (!historyMessage) throw new Error("this historyMessage doesn't exist")
      historyMessage = historyMessage.map((data) => {
        return {
          userId: data.User.id,
          name: data.User.name,
          avatar: data.User.avatar,
          account: data.User.account,
          message: data.message,
          createdAt: data.createdAt
        }
      })

      return res.json(historyMessage)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = chatController
