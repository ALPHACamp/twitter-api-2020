const db = require('../../models')
const socket = require('../../socket/socket')
const Message = db.Message
const User = db.User

let socketController = {
  getPublicHistory: (offset, limit, cb) => {
    const message = await Message.findAll({
      offset,
      limit,
      order: [['createdAt', 'desc']],
      include: [
        {
          model: User,
          attributes: ['avatar'],
          as: 'User'
        }
      ]
    })
    cb(message)
  },
  joinPublicRoom: ({ userId }) => {
    const user = await User.findByPk(userId)
    return {
      name: user.name
    }
  },
  postPublicMsg: async ({ msg, userId }) => {
    const message = await Message.create({
      RoomId: 1,
      UserId: userId,
      content: msg
    })
    const user = await User.findByPk(userId)
    return {
      msg: message.content,
      createdAt: message.createdAt,
      avatar: user.avatar
    }
  },
}
module.exports = socketController