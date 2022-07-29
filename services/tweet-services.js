const { User, Tweet, Reply, Like } = require('../models')

const tweetServices = {
  getTweets: async (req, cb) => {
    try {
      const tweets = await Tweet.findAll({
        nest: true,
        raw: true,
        order: [['createdAt', 'DESC']],
        include: [{ model: User, attributes: ['id', 'account', 'name', 'avatar'] }]
      })
      const results = []
      await Promise.all(tweets.map(async tweet => {
        const TweetId = tweet.id
        const likeCount = await Like.count({ where: { TweetId } })
        const replyCount = await Reply.count({ where: { TweetId } })
        results.push(
          {
            ...tweet,
            likeCount,
            replyCount
          })
      }))
      return cb(null, results)
    } catch (err) {
      return cb(err)
    }
  },
  getTweet: async (req, cb) => {
    try {
      const TweetId = Number(req.params.id)
      const tweet = await Tweet.findByPk(
        TweetId, {
          nest: true,
          raw: true,
          include: [{ model: User, attributes: ['id', 'account', 'name', 'avatar'] }]
        }
      )

      let results = {}
      const likeCount = await Like.count({ where: { TweetId } })
      const replyCount = await Reply.count({ where: { TweetId } })
      results = {
        ...tweet,
        likeCount,
        replyCount
      }
      return cb(null, results)
    } catch (err) {
      return cb(err)
    }
  },
  postTweet: async (req, cb) => {
    try {
      const UserId = req.user.dataValues.id
      const { description } = req.body
      if (!description) throw new Error('The tweet can not be empty!')

      const createdTweet = await Tweet.create({
        UserId,
        description
      })
      return cb(null, createdTweet)
    } catch (err) {
      return cb(err)
    }
  }
}

module.exports = tweetServices
