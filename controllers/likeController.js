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
  },
  unlike: async (req, res) => {
    try {
      const like = await Like.findOne({
        where: {
          UserId: helpers.getUser(req).id,
          TweetId: req.params.tweet_id
        }
      })
      await like.destroy()
      const tweet = await Tweet.findByPk(req.params.tweet_id)
      await tweet.decrement(['likeCount'], { by: 1 })
      const data = { status: 'success', message: 'the tweet was successfully unliked' }
      return res.json(data)
    } catch (err) {
      const data = { status: 'error', message: err }
      return res.json(data)
    }
  }
}

module.exports = likeController
