const { Tweet, User, Like, Reply } = require('../models')
const { getUser } = require('../_helpers')

const tweetController = {
  getAllTweet: async (req, res, next) => {
    try {
      const userId = getUser(req).id
      const rawTweets = await Tweet.findAll({
        include: [
          {
            model: User,
            attributes: ['name', 'account', 'avatar']
          },
          {
            model: Like,
            attributes: ['tweet_id', 'user_id']
          },
          {
            model: Reply,
            attributes: ['tweet_id', 'user_id']
          }
        ],
        order: [
          ['created_at', 'DESC']
        ]
      })

      const tweets = rawTweets.map((tweet, _index) => ({
        ...tweet.toJSON(),
        likeCounts: tweet.Likes.length,
        repliesCounts: tweet.Replies.length
      }))

      res.json(tweets)
    } catch (err) {
      next(err)
    }
  },
}

module.exports = tweetController