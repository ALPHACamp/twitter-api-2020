const { User, Tweet } = require('../models')
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
  }
}

module.exports = adminController
