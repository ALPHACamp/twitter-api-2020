const helpers = require('../_helpers')
const db = require('../models')
const { Like, Tweet } = db

const likeServices = {
  likeTweet: (req, cb) => {
    const currentUserId = Number(helpers.getUser(req).id)
    const TweetId = Number(req.params.id)
    Promise.all([
      Tweet.findByPk(TweetId),
      Like.findOne({
        where: {
          UserId: currentUserId,
          TweetId
        }
      })
    ])
      .then(([tweet, like]) => {
        if (!tweet) return cb(Object.assign(new Error('找不到這篇推文'), { status: 404 }))
        if (like) return cb(new Error('已經按過讚了'))
        return Like.create({
          UserId: currentUserId,
          TweetId
        }).then(like => cb(null, like))
          .catch(err => cb(err, null))
      })
  },
  unlikeTweet: (req, cb) => {
    const currentUserId = Number(helpers.getUser(req).id)
    const TweetId = Number(req.params.id)
    Promise.all([
      Tweet.findByPk(TweetId),
      Like.findOne({
        where: {
          UserId: currentUserId,
          TweetId
        }
      })
    ])
      .then(([tweet, like]) => {
        if (!tweet) return cb(Object.assign(new Error('找不到這篇推文'), { status: 404 }))
        if (!like) return cb(new Error('尚未按過讚'))
        return like.destroy()
          .then(like => cb(null, like))
          .catch(err => cb(err, null))
      })
  }

}

module.exports = likeServices
