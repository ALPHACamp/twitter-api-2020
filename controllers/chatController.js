const helpers = require('../_helpers')
const Sequelize = require('sequelize')
const { Op } = require("sequelize")
const { Chat, User, Chatroom, UserRoom } = require('../models')

const chatController = {
  getContent: async (req, res, next) => {
    try {
      const room = await Chatroom.findByPk(req.params.roomId, {
        include: [
          {
            model: User, as: 'Users',
            attributes: ['id', 'name', 'avatar'],
            include: [Chat]
          }
        ]
      })
      res.json(room)
    }
    catch (err) {
      next(err)
    }
  },
  postMessage: async (req, res, next) => {
    try {
      await Chat.create({
        UserId: helpers.getUser(req).id,
        message: req.body.message,
        ChatroomId: req.params.roomId
      })

      res.json({ status: 'success', message: '發送成功' })
    }
    catch (err) {
      next(err)
    }
  }
}

module.exports = chatController