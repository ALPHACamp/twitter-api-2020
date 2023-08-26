const { Tweet, User, Reply } = require('../models')
const { relativeTimeFromNow } = require('../helpers/dayjs-helpers')

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

      if (!tweets) throw new Error('目前沒有任何推文。')

      const data = tweets.map(tweet => ({
        ...tweet.toJSON(),
        createdAt: relativeTimeFromNow(tweet.createdAt),
        repliedAmount: tweet.Replies.length || 0,
        likedAmount: tweet.LikedUsers.length || 0
      }))

      return res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
