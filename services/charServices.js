const helpers = require('../_helpers')
const db = require('../models')
const User = db.User
const Chat = db.Chat
const Message = db.Message

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
    return Promise.all([
      Chat.findAll({ include: [User] }),
      Message.findAll({ include: [User] })
    ])
      .then(([chatUser, histroy]) => {
        return callback({ chatUser, histroy })
      })
      .catch(err => console.log(err))
  },

  postMessage: (req, res, callback) => {
    const USERID = helpers.getUser(req).id
    const entryMsg = req.body.text.trim()
    if (entryMsg) {
      Chatmessage.create({
        UserId: USERID,
        text: entryMsg
      }).then(msg => { return callback({ status: 'success', message: 'add in history' }) })
    } else {
      return callback({ status: 'error', message: 'Msg can not be blank' })
    }

  }
}

module.exports = chatServices