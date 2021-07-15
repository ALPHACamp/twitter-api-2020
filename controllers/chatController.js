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

}

module.exports = chatController