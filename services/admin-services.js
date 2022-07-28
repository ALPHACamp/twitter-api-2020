const db = require('../models')
const { User, Tweet, Like } = db
const { Op } = require("sequelize")
const bcrypt = require('bcryptjs')

const adminServices = {
  getUsers: async (req, cb) => {
    return await User.findAndCountAll({
      where: {
        [Op.not]: [
          { role: 'admin' },
        ]
      },
      // order: [['', 'DESC']],  // ! 排序還沒有寫出來
      include: [Like, Tweet],
      // raw: true,
      nest: true
    })
      // ! 還沒成功取出Tweet&Like的數量
      .then(users => cb(null, { users }))
      .catch(err => cb(err))
  },
  getTweets: async (req, cb) => {
    await Tweet.findAll({
      order: [['createdAt', 'DESC']], //? post tweet功能做好後測試 order 功能
      include: [User],
      raw: true,
      nest: true
    })
      .then(tweets => cb(null, { tweets }))
      .catch(err => cb(err))
  },
  deleteTweet: async (req, cb) => {
    await Tweet.findByPk(req.params.id)
      .then(tweet => {
        if (!tweet) throw new Error("tweet didn't exist!")
        return tweet.destroy()
      })
      .then(deletedTweet => cb(null, { tweet: deletedTweet }))
      .catch(err => cb(err))
  }
}

module.exports = adminServices