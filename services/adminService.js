const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like


const adminService = {
  signIn: (req, res, callback) => { },
  getUsers: async (req, res, callback) => {
    try {
      const users = await User.findAll({
        where: { role: 'user' },
        include: [
          { model: Like },
          { model: Reply },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      })
      callback({ users })
    } catch (err) {
      callback({ status: 'error', message: 'codeStatus 500' })
    }
  },
  getTweets: (req, res, callback) => { },
  deleteTweets: (req, res, callback) => { }
}

module.exports = adminService