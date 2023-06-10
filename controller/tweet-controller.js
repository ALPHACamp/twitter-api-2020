const { Tweet, User, Reply, Like } = require('../models')
const helpers = require('../_helpers')
const tweetController = {
  createTweet: async (req, res, next) => {
    try {
      const reqUserId = helpers.getUser(req).id
      const { description } = req.body
      // 檢查推文內容是否為空白或超過字數限制
      if (!description || description.length > 140) {
        return res.status(400).json({ status: 'error', message: 'Invalid tweet description' })
      }
      // 將推文存入資料庫
      const tweet = await Tweet.create({
        description,
        UserId: reqUserId
      })
      return res.json({ status: 'success', data: tweet })
    } catch (err) {
      next(err)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      const reqUserId = helpers.getUser(req).id
      let tweets = await Tweet.findAll({
        raw: true,
        nest: true,
        include: [User, Reply, Like],
        order: [['createdAt', 'DESC']]
      })
      tweets = tweets.map(tweet => ({
        UserId: reqUserId,
        description: tweet.description,
        createdAt: tweet.createdAt,
        replyCount: tweet.Replies.length,
        likeCount: tweet.Likes.length,
        user: {
          avatar: tweet.User.avatar,
          name: tweet.User.name,
          account: tweet.User.account
        }
      }))
      return res.status(200).json(tweets)
    } catch (err) {
      next(err)
    }
  },
  getTweet: async (req, res, next) => {
    try {
      const reqUserId = helpers.getUser(req).id
      const tweetId = req.params.tweet_id
      let tweet = await Tweet.findByPk(tweetId, {
        include: [User, Like, Reply]
      })

      if (!tweet) throw new Error('Tweet not found')

      tweet = {
        id: tweet.id,
        description: tweet.description,
        createdAt: tweet.createdAt,
        updatedAt: tweet.updatedAt,
        likeCount: tweet.Likes.length,
        replyCount: tweet.Replies.length,
        user: {
          UserId: reqUserId,
          name: tweet.User.name,
          account: tweet.User.account,
          avatar: tweet.User.avatar
        }

      }

      return res.status(200).json(tweet)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = tweetController
