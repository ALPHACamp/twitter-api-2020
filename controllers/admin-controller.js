const { User, Tweet, Like, Followship } = require('../models')
const jwt = require('jsonwebtoken')
const helpers = require('../_helpers')
const { newErrorGenerate } = require('../helpers/newError-helper')
const { relativeTimeFromNow } = require('../helpers/dayFix-helper')
const TWEETS_WORD_INDICATE = 50

const adminController = {
  // 後台登入
  signIn: (req, res, next) => {
    try {
      const userData = helpers.getUser(req).toJSON()
      if (userData.role !== 'admin') newErrorGenerate('帳號不存在！', 404)
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' }) // 簽發 JWT，效期為 30 天
      return res.json({
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
  // 取得所有推文及該推文使用者資料
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        raw: true,
        nest: true,
        include: [User]
      })
      const tweetsData = tweets?.map(tweet => ({
        ...tweet,
        description: tweet.description.substring(0, TWEETS_WORD_INDICATE),
        relativeTimeFromNow: relativeTimeFromNow(tweet.createdAt)
      }))
      return res.json({ status: 'success', data: { tweetsData } })
    } catch (err) {
      next(err)
    }
  },
  // 管理員能夠刪除貼文
  deleteTweet: async (req, res, next) => {
    try {
      const tweetId = req.params.id
      const tweet = await Tweet.findByPk(tweetId)
      if (!tweet) newErrorGenerate('該篇推文不存在', 404)
      const deletedTweet = await tweet.destroy()
      return res.json({ status: 'success', data: { deletedTweet } })
    } catch (err) {
      next(err)
    }
  },
  // 取得所有使用者資料
  getUsers: async (req, res, next) => {
    const users = await User.findAll({
      raw: true,
      nest: true
    })
    const userData = await Promise.all(users.map(async user => {
      const userId = user.id
      let tweetsCount = await Tweet.findAll({ where: { UserId: userId }, raw: true, attributes: ['id'] })
      let likesCount = await Like.findAll({ where: { UserId: userId }, raw: true, attributes: ['id'] })
      let followersCount = await Followship.findAll({ where: { followerId: userId }, raw: true, attributes: ['id'] })
      let followingsCount = await Followship.findAll({ where: { followingId: userId }, raw: true, attributes: ['id'] })
      tweetsCount = tweetsCount?.length
      likesCount = likesCount?.length
      followersCount = followersCount?.length
      followingsCount = followingsCount?.length
      user.tweetsCount = tweetsCount
      user.likesCount = likesCount
      user.followersCount = followersCount
      user.followingsCount = followingsCount
      delete user.password
      return user
    }))
    return res.json(userData)
  }
}

module.exports = adminController
