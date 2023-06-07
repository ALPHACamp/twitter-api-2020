const db = require('../models')
const { User, Tweet, Reply } = db
const sequelize = require('sequelize')
const { getUser } = require('../_helpers')

const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        attributes: {
          include: [
            [
              sequelize.literal(
                '(SELECT COUNT(*) FROM Replies WHERE TweetId = Tweet.id)'
              ), 'repliesCount'
            ],
            [
              sequelize.literal(
                '(SELECT COUNT(*) FROM Likes WHERE TweetId = Tweet.id AND isLike = 1)'
              ), 'likesCount'
            ]
          ]
        },
        include: [
          {
            model: User,
            attributes: { exclude: ['password'] }
          }
        ],
        order: [['createdAt', 'DESC']]
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
      const tweetId = req.params.tweetId
      const tweet = await Tweet.findByPk(tweetId, {
        attributes: {
          include: [
            [
              sequelize.literal(
                '(SELECT COUNT(*) FROM Replies WHERE TweetId = Tweet.id)'
              ), 'repliesCount'
            ],
            [
              sequelize.literal(
                '(SELECT COUNT(*) FROM Likes WHERE TweetId = Tweet.id AND isLike = 1)'
              ), 'likesCount'
            ]
          ]
        },
        include: [
          {
            model: User,
            attributes: { exclude: ['password'] }
          }
        ]
      })
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
  },
  postReply: async (req, res, next) => {
    try {
      const tweetId = req.params.tweetId
      const { comment } = req.body
      if (!comment) throw new Error('請輸入內容！')
      await Reply.create({
        UserId: getUser(req).id,
        TweetId: tweetId,
        comment
      })
      res.json({
        status: 'success', message: '成功建立留言'
      })
    } catch (error) {
      next(error)
    }
  },
  getReplies: async (req, res, next) => {
    try {
      const tweetId = req.params.tweetId
      const replies = await Reply.findAll({
        where: { TweetId: tweetId },
        include: [
          { model: User, attributes: { exclude: ['password'] } }
        ],
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })
      res.json(replies)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = tweetController
