const helpers = require('../_helpers')
const db = require('../models')
const Like = db.Like
const Tweet = db.Tweet

const likeController = {
  like: async (req, res) => {
    try {
      await Like.create({
        UserId: helpers.getUser(req).id,
        TweetId: req.params.tweet_id
      })
      const tweet = await Tweet.findByPk(req.params.tweet_id)
      tweet.increment(['likeCount'], { by: 1 })
      const data = { status: 'success', message: 'the tweet was successfully liked' }
      return res.json(data)
    } catch (err) {
      const data = { status: 'error', message: err }
      return res.json(data)
    }
  }
}

module.exports = likeController
