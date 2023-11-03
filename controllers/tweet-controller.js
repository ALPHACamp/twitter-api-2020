const { Tweet, User, Reply } = require('../models')

const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        include: [
          { model: User },
          { model: Reply },
          { model: User, as: 'LikedUsers' }
        ],
        order: [['createdAt', 'DESC']]
      })
      const data = tweets.map(tweet => ({
        ...tweet.toJSON(),
        repliesAmount: tweet.Replies.length || 0,
        likesAmount: tweet.LikedUsers.length || 0
      }))

      res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
