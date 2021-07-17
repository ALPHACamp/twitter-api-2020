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
    io.emit('new-join', {
      name: user.name
    })
  },
  postPublicMsg: async ({ msg, userId }) => {
    const message = await Message.create({
      RoomId: 1,
      UserId: userId,
      content: msg
    })
    const user = await User.findByPk(userId)
    socket.broadcast.emit('get-public-msg', {
      msg: message.content,
      createdAt: message.createdAt,
      avatar: user.avatar
    })
  },
}
module.exports = socketController