const helpers = require('../_helpers')
const Sequelize = require('sequelize')
const { Op } = require("sequelize")
const { Chat, User, Chatroom, UserRoom } = require('../models')

const chatController = {
  getContent: async (req, res, next) => {
    try {
      const room = await Chat.findAll({
        where: { ChatroomId: 5 },
        include: [{ model: User, attributes: ['id', 'name', 'avatar'] }],
      })
      return res.json(room)
    }
    catch (err) {
      console.log(err)
    }
  },
}

module.exports = chatController