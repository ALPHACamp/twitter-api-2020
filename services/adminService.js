const db = require('../models')
const { Tweet, User, Reply, Like } = db


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
  getTweets: async (req, res, callback) => {
    try {
      const tweets = await Tweet.findAll({ include: [{ model: User }] })
      callback({ tweets })
    } catch (err) {
      callback({ status: 'error', message: 'codeStatus 500' })
    }
  },
  deleteTweets: (req, res, callback) => { }
}

module.exports = adminService