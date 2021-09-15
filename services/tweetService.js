const { Tweet, Reply, Like, User, Sequelize } = require('../models')

// 新增推文 - POST /tweets
// post('/api/tweets')
const TweetService = {
  postTweet: async (req, res, callback) => {
    const { UserId, description } = req.body
    if (!description.trim().length) {
      return callback({ status: 'error', message: "tweet content can't be blank" })
    }

    try {
      await Tweet.create({
        UserId,
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
  }
}

module.exports = TweetService
