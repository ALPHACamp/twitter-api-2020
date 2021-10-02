const { Chat, Sequelize, User, Room, Member } = require('../models')
const { Op } = Sequelize

let chatroomController = {
  postChat: async (user, msg, roomId) => {
    try {
      return await Chat.create({
        UserId: user.id,
        text: msg,
        RoomId: roomId,
      })
    } catch (err) { console.log(err) }
  },
  getHistoryMsg: async (req, res, next) => {
    try {
      const chat = await Chat.findAll({
        attributes: [
          ['id', 'ChatId'], 'createdAt', 'text', 'roomId'
        ],
        include: [
          {
            model: User, attributes: ['id', 'name', 'avatar', 'account'],
            where: { role: { [Op.not]: 'admin' } }
          }],
        order: [['createdAt', 'ASC']],
        raw: true,
        nest: true
      })
      return res.status(200).json(chat)
    } catch (err) {
      next(err)
    }
  },


module.exports = chatroomController