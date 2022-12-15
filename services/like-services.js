const assert = require('assert')
const { Like, Tweet } = require('../models')

const likeServices = {
  addLike: (req, cb) => {
    const UserId = req.user.id
    const TweetId = req.params.id
    console.log(TweetId)
    return Promise.all([
      Tweet.findByPk(TweetId),
      Like.findOne({ where: { TweetId, UserId } })
    ])
      .then(([tweet, like]) => {
        assert(tweet, "The tweet doesn't exit!")
        assert(!like, "You've liked this tweet already!")
        return Like.create({
          UserId,
          TweetId
        })
      })
      .then(addLike => cb(null, { addLike }))
      .catch(err => cb(err))
  },
  unLike: (req, cb) => {
    const UserId = req.user.id
    const TweetId = req.params.id
    console.log(TweetId)
    return Promise.all([
      Tweet.findByPk(TweetId),
      Like.findOne({ where: { TweetId, UserId } })
    ])
      .then(([tweet, like]) => {
        assert(tweet, "The tweet doesn't exit!")
        assert(like, "You've not liked this tweet before!")
        return like.destroy()
      })
      .then(unLike => cb(null, { unLike }))
      .catch(err => cb(err))
  }
}
module.exports = likeServices
