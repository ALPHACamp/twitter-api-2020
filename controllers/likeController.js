const db = require('../models')
const User = db.User
const Like = db.Like
const helpers = require('../_helpers')

const likeController = {
  postLike: (req, res) => {
    Like.findOne({
      where: { $and: {
        UserId: helpers.getUser(req).id,
        TweetId: req.params.tweetId,
      }}
    }).then(like => {
      if (like) {
        return res.json({ status: 'error', message: 'Like added already' })
      }
      Like.create({
        UserId: helpers.getUser(req).id,
        TweetId: req.params.tweetId
      })
        .then(like => {
          return res.json({ status: 'success', message: 'Like added' })
        })
    })

  },
  postUnlike: (req, res) => {
    Like.findOne({
      where: {
        $and: {
          UserId: helpers.getUser(req).id,
          TweetId: req.params.tweetId,
        }
      }
    }).then(like => {
      if (!like) {
        return res.json({ status: 'error', message: "Haven't liked before" })
      }
      like.destroy()
        .then(like => {
          return res.json({ status: 'success', message: 'Removed like successfully'})
        })
    })
  }
}

module.exports = likeController