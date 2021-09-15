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
      console.log('postTweet', err)
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
        isLike: false,
        User: {
          id: r.User.id,
          name: r.User.name,
          avatar: r.User.avatar,
          account: r.User.account
        }
      }))
      callback(200, data)
    } catch (err) {
      console.log('getTweets', err)
      res.sendStatus(500)
    }
  }
}

module.exports = TweetService
