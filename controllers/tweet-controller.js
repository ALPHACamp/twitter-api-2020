const db = require('../models')
const { Op } = require('sequelize')
const { Tweet } = db

const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        sort: ['createdAt', 'DESC']
      })
      if (!tweets) throw new Error('找不到tweets資料！')
      // 回傳全部tweet，最新的在前面
      res.json(tweets)
    } catch (err) {
      next(err)
    }
  },
  getTweet: async (req, res, next) => {
    try {
      const tweedId = req.params.tweetId
      const tweet = await Tweet.findByPk(tweedId)
      if (!tweet) throw new Error('找不到tweet資料！')
      // 回傳一則tweet
      res.json(tweet)
    } catch (err) {
      next(err)
    }
  },
  postTweet: async (req, res, next) => {
    try {
      const { description } = req.body
      if (!description) throw new Error('請輸入內容！')

      await Tweet.create({
        userId: req.user.id,
        description
      })
      // 回傳成功訊息
      res.json({
        status: 'success',
        message: '成功建立Tweet'
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
