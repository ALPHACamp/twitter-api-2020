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
      return res.json([{ status: 'success', data: tweets }])
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
