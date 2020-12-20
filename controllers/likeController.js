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
  unlike: (req, res) => {}
}

module.exports = likeController
