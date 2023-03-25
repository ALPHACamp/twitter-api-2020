const helpers = require('../_helpers')
const db = require('../models')
const { Like } = db

const likeServices = {
  likeTweet: (req, cb) => {
    const currentUserId = Number(helpers.getUser(req).id)
    const id = Number(req.params.id)
    Like.findOne({
      where: {
        UserId: currentUserId,
        TweetId: id
      }
    })
      .then(like => {
        if (like) throw new Error('已經按過讚了')
        return Like.create({
          UserId: currentUserId,
          TweetId: id
        }).then(like => cb(null, like))
          .catch(err => cb(err, null))
      }
      )
      .catch(err => cb(err, null))
  },
  unlikeTweet: (req, cb) => {
    const currentUserId = Number(helpers.getUser(req).id)
    const id = Number(req.params.id)
    Like.findOne({
      where: {
        UserId: currentUserId,
        TweetId: id
      }
    })
      .then(like => {
        if (!like) throw new Error('尚未按過讚')
        return like.destroy()
          .then(like => cb(null, like))
          .catch(err => cb(err, null))
      }
      )
      .catch(err => cb(err, null))
  }
}

module.exports = likeServices
