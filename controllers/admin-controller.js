const { User, Tweet, Reply, Like } = require('../models')
const helpers = require('../_helpers')
const jwt = require('jsonwebtoken')

const adminController = {
  signIn: async (req, res, next) => {
    const userData = helpers.getUser(req).toJSON()
    try {
      // Admin only
      if (userData.role !== 'admin') throw new Error('Account or Password is wrong!')
      delete userData.password
      delete userData.introduction
      delete userData.avatar
      delete userData.cover
      delete userData.tweetCount
      delete userData.followerCount
      delete userData.followingCount
      delete userData.likeCount
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.json({
        status: 'success',
        data: {
          token,
          admin: userData
        },
        message: 'Admin 登入成功！'
      })
    } catch (err) {
      next(err)
    }
  },
  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        where: { role: 'user' },
        order: [['tweetCount', 'DESC']],
        attributes: { exclude: ['password'] },
        raw: true
      })
      if (!users.length) throw new Error('沒有任何使用者!')

      return res.status(200).json(users)
    } catch (err) { next(err) }
  },
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        nest: true,
        include: [{
          model: User,
          attributes: ['name', 'account', 'avatar']
        }],
        order: [['createdAt', 'DESC']],
        raw: true
      })
      const tweetsSubstr = tweets.map(tweet => ({
        ...tweet,
        description: tweet.description.substring(0, 50)
      }))

      return res.json({
        status: 'success',
        tweets: tweetsSubstr
      })
    } catch (err) {
      next(err)
    }
  },
  deleteTweet: async (req, res, next) => {
    try {
      const TweetId = req.params.id
      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) throw new Error('推文不存在！')

      const user = await User.findByPk(tweet.UserId)
      if (!user) throw new Error('使用者不存在，刪除推文動作失敗！')

      await Reply.destroy({ where: { TweetId } })
      await Like.destroy({ where: { TweetId } })
      await user.decrement('tweetCount', { by: 1 })
      await user.decrement('likeCount', { by: tweet.likeCount })

      return res.json({
        status: 'success',
        data: await tweet.destroy(),
        message: '成功刪除推文'
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController
