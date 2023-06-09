const jwt = require('jsonwebtoken')
const { User, Tweet } = require('../../models')
const { getUser } = require('../../_helpers')

const adminController = {
  adminLogin: async (req, res, next) => {
    try {
      const reqUser = getUser(req).toJSON()
      const token = jwt.sign(reqUser, process.env.JWT_SECRET, { expiresIn: '30d' })
      const { account } = req.body
      const user = await User.findOne({
        where: { account },
        raw: true
      })
      if (!user) throw new Error('You are not admin')
      if (user.role !== 'admin') throw new Error('You are not admin')
      const userData = user
      delete userData.password
      userData.token = token
      return res.json({ status: 'success', data: userData })
    } catch (error) {
      next(error)
    }
  },
  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll()
      return res.json({ status: 'success', data: users })
    } catch (error) {
      next(error)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll()
      return res.json({ status: 'success', data: tweets })
    } catch (error) {
      next(error)
    }
  },
  deleteTweet: async (req, res, next) => {
    try {
      const { id } = req.params
      const tweet = await Tweet.findByPk(id)
      console.log(tweet)
      if (!tweet) throw new Error('The tweet does not exist')
      await tweet.destroy()
      return res.json({ status: 'success', data: tweet })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = adminController
