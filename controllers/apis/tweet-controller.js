const { Tweet, Reply, Like } = require('../../models')

const tweetController = {
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      include: [
        Reply,
        Like
      ],
      order: [['createdAt', 'DESC']],
    })
      .then(tweets => {
        const formattedTweets = tweets.map(tweet => {
          return {
            ...tweet.get({ plain: true }),
          }
        })
        res.json(formattedTweets)
      })
      .catch(err => {
        res.status(500).json({ status: 'error', error: err.message })
      })
  }
}

module.exports = tweetController

