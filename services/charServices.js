const helpers = require('../_helpers')
const db = require('../models')
const User = db.User
const Chat = db.Chat

const chatServices = {
  postChatRoom: (req, res, callback) => {
    const USERID = helpers.getUser(req).id
    User.findByPk(USERID)
      .then(user => {
        console.log(user)
        Chat.create({
          UserId: USERID
        })
        return callback({ status: 'success', message: 'post in chatroom' })
      })
  },
  deleteChatRoom: (req, res, callback) => {
    const USERID = helpers.getUser(req).id
    Chat.findOne({ where: { UserId: USERID } })
      .then(chatUser => {
        if (chatUser) {
          chatUser.destroy()
        }
        return callback({ status: 'success', message: 'delete in chatroom' })
      })
  },

  getChatRoom: (req, res, callback) => {
    const USERID = helpers.getUser(req).id
    Chat.findAll({ include: [User] })
      .then(chatUser => {
        return callback(chatUser)
      })
  }
}

module.exports = chatServices