const helpers = require('../_helpers')
const Sequelize = require('sequelize')
const { Op } = require("sequelize")
const { Chat, User, Chatroom, UserRoom } = require('../models')

const chatController = {
  getContent: async (req, res, next) => {
    try {
      const room = await Chat.findAll({
        where: { ChatroomId: 5 },
        include: [{ model: User, attributes: ['id', 'name', 'avatar'] }]
      })
      res.json(room)
    }
    catch (err) {
      next(err)
    }
  },
  postMessage: async (data, req, next) => {
    try {
      await Chat.create({
        UserId: helpers.getUser(req),
        message: data.message,
        ChatroomId: data.ChatroomId
      })
    }
    catch (err) {
      console.log(err)
    }
  },
  createRoom: async (req, res, next) => {
    try {
      const { chatroom, create } = await Chatroom.findOrCreate({})
    }
    catch (err) {
      next(err)
    }
  }
}

module.exports = chatController