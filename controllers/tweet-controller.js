const { User, Tweet, Reply } = require('../models')

const tweetController = {
  getTweets: async (req, res, next) => {
    let tweets = await Tweet.findAll({
      include: [
        { model: User },
        { model: User, as: 'LikedUsers' },
        { model: Reply }
      ],
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true
    })
    if (!tweets) {
      return res.status(500).json({
        status: 'error',
        message: 'Tweets not find!'
      })
    }
    try {
      tweets = tweets.map(tweet => {
        return {
          ...tweet,
          description: tweet.description,
          repliedCount: tweet.Replies.length,
          likedCount: tweet.LikedUser.length,
          liked: req.user.LikedTweets ? req.user.LikedTweets.some(l => l.id === tweet.id) : false
        }
      })
      return res.status(200).json(tweets)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
