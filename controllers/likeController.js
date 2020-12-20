const helpers = require('../_helpers')

const db = require('../models')
const Like = db.Like
const Tweet = db.Tweet

const likeController = {
  like: (req, res, next) => {
    Tweet.findByPk(req.params.id, {
      include: Like
    }).then(tweet => {
      if (!tweet) {
        return res.status(404).json({ status: 'failure', message: 'this tweet not exist' })
      }
      if (tweet.UserId === helpers.getUser(req).id) {
        return res.status(400).json({ status: 'failure', message: "Don't be narcissism" })
      }
      return Like.findOrCreate({
        where: { TweetId: Number(req.params.id), UserId: Number(helpers.getUser(req).id) },
        default: { UserId: Number(helpers.getUser(req).id) }
      })
        .spread((like, created) => {
          if (!created) {
            return res.status(409).json({ status: 'failure', message: 'Already Liked' })
          } else {
            return res.json({ status: 'success', message: 'OK', like })
          }
        })
        .catch(next)
    })
  },
  unlike: (req, res, next) => {
    Tweet.findByPk(req.params.id, {
      include: Like
    }).then(tweet => {
      if (!tweet) {
        return res.status(404).json({ status: 'failure', message: 'this tweet not exist' })
      }
      return Like.findOne({
        where: {
          UserId: helpers.getUser(req).id,
          TweetId: req.params.id
        }
      })
        .then(like => {
          if (!like) {
            return res.status(409).json({ status: 'failure', message: 'unlike not exist' })
          }
          return like.destroy().then(unliked => {
            res.json({ status: 'success', message: 'OK', unliked })
          })
        })
        .catch(next)
    })
  }
}

module.exports = likeController
