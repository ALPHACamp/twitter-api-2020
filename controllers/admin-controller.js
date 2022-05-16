const createToken = require('../function/token')
const tweetServices = require('../services/tweets')
const { Tweet, User, Followship } = require('../models')

const adminController = {
  login: async (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      if (userData.role !== 'admin') res.status(403).json({ status: 'error', message: '非管理者' })
      const token = await createToken(userData)
      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },
  tweets: async (req, res) => {
    try {
      const tweets = await tweetServices.getAll()
      if (!(tweets.length)) return res.status(403).json({ status: 'error', message: '推文不存在' })
      tweets.forEach(element => {
        element.description = element.description.substring(0, 51)
      })
      res.json({
        status: 'success',
        data: {
          data: tweets
        }
      })
    } catch (err) {
      console.log(err)
    }
  },
  users: async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: {
          exclude: ['createdAt', 'password', 'introduction', 'updatedAt']
        },
        raw: true
      })
      const followers = await Followship.count({
        group: ['followerId'],
        raw: true
      })
      const followings = await Followship.count({
        group: ['followingId'],
        raw: true
      })
      // 下面可能可以用 [sequelize.fn("COUNT", sequelize.col('')), "count"]] 合併到資料庫搜索語法

      for (let followerIndex = 0; followerIndex < followers.length; followerIndex++) {
        for (let userIndex = 0; userIndex < users.length; userIndex++) {
          if (users[userIndex].id === followers[followerIndex].followerId) {
            users[userIndex].followers = followers[followerIndex].count
          } else {
            if (users[userIndex].followers === undefined) users[userIndex].followers = 0
          }
        }
      }
      for (let followingIndex = 0; followingIndex < followings.length; followingIndex++) {
        for (let userIndex = 0; userIndex < users.length; userIndex++) {
          if (users[userIndex].id === followings[followingIndex].followingId) {
            users[userIndex].followings = followings[followingIndex].count
          } else {
            if (users[userIndex].followings === undefined) users[userIndex].followings = 0
          }
        }
      }
      if (!users) return res.status(403).json({ status: 'error', message: '使用者不存在' })
      res.status(200)
        .json(users)
    } catch (err) {
      console.log(err)
    }
  },
  deleteTweet: async (req, res) => {
    try {
      const tweetId = req.params.id
      await Tweet.destroy({
        where: {
          id: tweetId
        }
      })
      res.json({
        status: 'success'
      })
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = adminController
