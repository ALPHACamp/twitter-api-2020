const db = require('../models')
const { Message, User } = db

const messageService = {
  getHistoryMessage: async (req, res, cb) => {
    try {
      const RoomId = req.params.roomId
      //傳入歷史訊息
      return cb(
        await Message.findAll({
          raw: true, nest: true,
          attributes: ['id', 'content', 'createdAt'],
          where: { RoomId },
          include: {
            model: User,
            as: 'Senders',
            attributes: ['id', 'avatar']
          },
          order: [['createdAt', 'ASC']]
        })
      )
    } catch (err) {
      console.warn(err)
      return cb({ status: '500', message: err })
    }
  }
}

module.exports = messageService