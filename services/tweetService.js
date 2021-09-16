const { Tweet, Reply, Like, User, Sequelize } = require('../models')
const helpers = require('../_helpers')
// 新增推文 - POST /tweets
// post('/api/tweets')
const TweetService = {
  postTweet: async (req, res, callback) => {
    const { description } = req.body
    if (!description.trim().length) {
      return callback({ status: 'error', message: "tweet content can't be blank" })
    }

    try {
      await Tweet.create({
        UserId: helpers.getUser(req).id,
        description
      })
      callback(200, {
        status: 'success',
        message: 'tweet was successfully created'
      })
    } catch (err) {
      console.log('postTweet error', err)
      res.sendStatus(500)
    }
  },
  getTweets: async (req, res, callback) => {
    try {
      const tweets = await Tweet.findAll({
        order: [['createdAt', 'DESC']],
        include: [User, Reply, Like]
      })

      const data = tweets.map(r => ({
        TweetId: r.id,
        description: r.description,
        createdAt: r.createdAt,
        LikesCount: r.Likes.length,
        RepliesCount: r.Replies.length,
        isLike: r.Likes.find(like => like.UserId === helpers.getUser(req).id) !== undefined,
        User: {
          id: r.User.id,
          name: r.User.name,
          avatar: r.User.avatar,
          account: r.User.account
        }
      }))
      callback(200, data)
    } catch (err) {
      console.log('getTweets error', err)
      res.sendStatus(500)
    }
  },
  getTweet: async (req, res, callback) => {
    try {
      const id = req.params.tweet_id
      const tweet = await Tweet.findByPk(id, {
        attributes: { exclude: ['UserId', 'updatedAt'] },
        include: [
          { model: User, attributes: ['id', 'name', 'avatar', 'account'] },
          { model: Reply, attributes: ['id', 'comment', 'createdAt'], include: { model: User, attributes: ['id', 'name', 'avatar', 'account'] } },
          Like
        ],
        order: [[Reply, 'createdAt', 'DESC']]
      })
      const data = tweet.toJSON()
      data.RepliesCount = tweet.Replies.length
      data.LikesCount = tweet.Likes.length
      data.isLike = tweet.Likes.find(like => like.UserId === helpers.getUser(req).id) !== undefined
      delete data.Likes

      callback(200, data)
    } catch (err) {
      console.log('getTweet error', err)
      res.sendStatus(500)
    }
  }
}

module.exports = TweetService
