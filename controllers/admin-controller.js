const { User, Tweet, Like, Reply } = require('../models')
const jwt = require('jsonwebtoken')
const helpers = require('../_helpers')
const { newErrorGenerate } = require('../helpers/newError-helper')
const { relativeTimeFromNow } = require('../helpers/dayFix-helper')
const { Sequelize } = require('sequelize')
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
      const tweetsData = tweets.map(tweet => ({
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
      await Reply.destroy({ where: { TweetId: tweetId } })
      await Like.destroy({ where: { TweetId: tweetId } })
      await tweet.destroy()
      return res.status(200).json({ status: 'success', message: '已成功刪除推文' })
    } catch (err) {
      next(err)
    }
  },
  // 取得所有使用者資料
  getUsers: async (req, res, next) => {
    const users = await User.findAll({
      attributes: [
        'id',
        'name',
        'account',
        'backgroundImage',
        'avatar',
        [Sequelize.literal('(SELECT COUNT(*) FROM `Tweets` WHERE `Tweets`.`UserId` = `User`.`id`)'), 'tweetsCount'],
        [Sequelize.literal('(SELECT COUNT(*) FROM `Followships` WHERE `Followships`.`followingId` = `User`.`id`)'), 'followersCount'],
        [Sequelize.literal('(SELECT COUNT(*) FROM `Followships` WHERE `Followships`.`followerId` = `User`.`id`)'), 'followingsCount']
      ],
      include: [
        { model: Tweet, attributes: ['id'], include: [{ model: Like, attributes: ['id'] }] }
      ]
    })
    const userData = users.map(user => {
      let likesCount = 0
      user.Tweets.forEach(element => {
        const count = element.Likes.length
        likesCount = likesCount + count
      })
      const result = {
        ...user.toJSON(),
        likesCount: likesCount
      }
      delete result.Tweets
      return result
    })
    const userSortData = userData.sort((a, b) => b.tweetsCount - a.tweetsCount)
    return res.json(userSortData)
  }
}

module.exports = adminController
