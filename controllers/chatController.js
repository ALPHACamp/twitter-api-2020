const db = require('../models/index')
const { catchError } = require('../utils/errorHandling')
const Chat = db.Chat
const User = db.User

module.exports = {
  getPublicChat: (req, res) => {
    return Chat.findAll({
      attributes: ['id', 'message', 'createdAt'],
      include: { model: User, attributes: ['id', 'name', 'avatar'] },
      order: [['createdAt', 'ASC']]
    })
      .then(chat => {
        console.log(chat[0])
        const data = chat.map(chat => ({
          id: chat.dataValues.id,
          message: chat.dataValues.message,
          createdAt: chat.dataValues.createdAt,
          userId: chat.User.dataValues.id,
          name: chat.User.dataValues.name,
          avatar: chat.User.dataValues.avatar
        }))
        return res.status(200).json(data)
      })
      .catch(error => {
        catchError(res, error)
      })
  }
}
