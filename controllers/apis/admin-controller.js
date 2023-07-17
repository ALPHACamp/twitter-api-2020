const jwt = require('jsonwebtoken')
const { User, Tweet, Like, Reply } = require('../../models')
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

      // 錯誤處理
      if (!user || user.role !== 'admin') {
        const error = new Error('You are not admin')
        error.status = 404
        throw error
      }
      const userData = user
      delete userData.password
      userData.token = token
      return res.status(200).json(userData)
    } catch (error) {
      next(error)
    }
  },
  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        attributes: ['id', 'name', 'account', 'avatar', 'background'],
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' },
          { model: Tweet, as: 'UserTweets' }
        ]
      })

      const data = users.map(user => {
        const { Followers, Followings, UserTweets, ...userData } = user.toJSON()
        let likedCount = 0
        for (const i of UserTweets) {
          likedCount += i.likedCount
        }
        userData.followerCount = Followers.length
        userData.followingCount = Followings.length
        userData.userTweetCount = UserTweets.length
        userData.likedCount = likedCount
        return userData
      })
      const dataSorted = data.sort((a, b) => b.userTweetCount - a.userTweetCount)
      return res.status(200).json(dataSorted)
    } catch (error) {
      next(error)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        include: [{ model: User, as: 'TweetUser', attributes: ['id', 'name', 'account', 'avatar'] }],
        order: [['createdAt', 'DESC']]
      })

      // 50字快覽
      const data = tweets.map(tweet => {
        const { description, ...rest } = tweet.toJSON()
        return {
          ...rest,
          description: description.length >= 50 ? description.slice(0, 50) : description
        }
      })

      return res.status(200).json(data)
    } catch (error) {
      next(error)
    }
  },
  deleteTweet: async (req, res, next) => {
    try {
      const { id } = req.params
      const tweet = await Tweet.findByPk(id)

      if (!tweet) throw new Error('The tweet does not exist')
      await Promise.all([
        tweet.destroy(),
        Like.destroy({ where: { TweetId: id } }),
        Reply.destroy({ where: { TweetId: id } })
      ])
      return res.status(200).json({ status: 'success', message: 'The tweet was successfully deleted' })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = adminController
