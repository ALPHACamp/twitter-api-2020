const { Tweet } = require('../../models')

const tweetController = {
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      order: [['createdAt', 'DESC']],
      nest: true,
      raw: true
    })
      .then(tweets => res.json({ tweets }))
      .catch(err => {
        res.status(500).json({ status: 'error', error: err.message })
      })
  }
}
module.exports = tweetController
