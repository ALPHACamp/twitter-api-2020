const helpers = require('../_helpers')
const {
  Tweet, User, Like,
  Reply, sequelize
} = require('../models')

const tweetController = {
  // 回傳所有推文(包含當前使用者回覆以及喜歡的推文)
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        include: [
          {
            model: User,
            attributes: { exclude: ['password'] }
          }, {
            model: Reply
          }, {
            model: Like
          }
        ],
        order: [['createdAt', 'DESC']]
      })
      const userId = req.user.id
      const returnTweets = tweets.map(tweet => {
        const returnTweet = tweet.toJSON()
        returnTweet.repliesCount = returnTweet.Replies.length
        returnTweet.likesCount = returnTweet.Likes.length
        returnTweet.isLiked = returnTweet.Likes.some(Like => Like.UserId === userId)
        return returnTweet
      })

      return res
        .status(200)
        .json(returnTweets)
    } catch (err) { next(err) }
  },
  getTweet: async (req, res, next) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id, {
        include: [
          {
            model: User,
            attributes: { exclude: ['password'] }
          }, {
            model: Reply
          }, {
            model: Like
          }
        ],
        order: [
          [Reply, 'createdAt', 'DESC']
        ]
      })
      if (!tweet) throw new Error('tweet_id does not exist.')
      const userId = req.user.id
      const returnTweet = tweet.toJSON()
      returnTweet.repliesCount = returnTweet.Replies.length
      returnTweet.likesCount = returnTweet.Likes.length
      returnTweet.isLiked = returnTweet.Likes.some(Like => Like.UserId === userId)

      return res.status(200).json(returnTweet)
    } catch (err) { next(err) }
  },
  postTweets: async (req, res, next) => {
    try {
      const { description } = req.body
      const loginUserId = helpers.getUser(req).id

      // 正常新增
      const data = await sequelize.transaction(async transaction => {
        const [result] = await Promise.all([
          // 新增推文
          Tweet.create({
            UserId: loginUserId, description
          }, { transaction }),
          // 增加使用者推文數
          User.increment('tweetCount', {
            where: { id: loginUserId },
            by: 1,
            transaction
          })
        ])

        return result
      })

      return res
        .status(200)
        .json({
          status: 'success',
          data,
          message: '已新增推文內容'
        })
    } catch (err) { next(err) }
  }
}

exports = module.exports = tweetController
