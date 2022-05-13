const createToken = require('../function/token')
const { Tweet, User } = require('../models')

const adminController = {
  login: async (req, res) => {
    try {
      const userData = req.user.toJSON()
      if (userData.role !== 'admin') return res.status(403).json({ status: 'error', message: '非管理者' })
      const token = await createToken(userData)
      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      console.log(err)
    }
  },
  tweets: async (req, res) => {
    try {
      const tweets = await Tweet.findAll({ raw: true })
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
      const users = await User.findAll({ raw: true })
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
