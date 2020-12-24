const helpers = require('../_helpers')

const db = require('../models')
const Like = db.Like
const Tweet = db.Tweet

const likeController = {
  like: (req, res, next) => {
    const tweetId = req.params.id
    const userId = helpers.getUser(req).id

    Tweet.findByPk(tweetId)
      .then(tweet => {
        if (!tweet) {
          return res.status(404).json({ status: 'failure', message: 'this tweet not exist' })
        }
        if (tweet.UserId === userId) {
          return res.status(400).json({ status: 'failure', message: "Don't be narcissism" })
        }
        return Like.findOrCreate({
          where: { TweetId: Number(tweetId), UserId: Number(userId) },
          default: { UserId: Number(userId) }
        }).spread((like, created) => {
          if (!created) {
            return res.status(409).json({ status: 'failure', message: 'Already Liked' })
          } else {
            return res.json({ status: 'success', message: 'OK', like })
          }
        })
      })
      .catch(next)
  },
  unlike: (req, res, next) => {
    const tweetId = req.params.id
    const userId = helpers.getUser(req).id
    Tweet.findByPk(tweetId)
      .then(tweet => {
        if (!tweet) {
          return res.status(404).json({ status: 'failure', message: 'this tweet not exist' })
        }
        return Like.findOne({
          where: {
            UserId: userId,
            TweetId: tweetId
          }
        }).then(like => {
          if (!like) {
            return res.status(409).json({ status: 'failure', message: 'unlike not exist' })
          }
          return like.destroy().then(unliked => {
            res.json({ status: 'success', message: 'OK', unliked })
          })
        })
      })
      .catch(next)
  }
}

module.exports = likeController
