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
        deletedAt: ""
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
          deletedAt: ""
        }
      }
    }).then(like => {
      console.log('test Date.now(): ', Date.now())
      if (!like) {
        console.log(like)
        return res.json({ status: 'error', message: "Haven't liked before" })
      }
      like.update({
        deletedAt: Date.now()
        //若使用 new Date() 會有SequelizeValidationError: string violation: deletedAt cannot be an array or an object
      })
        .then(like => {
          console.log(like)
          return res.json({ status: 'success', message: 'Removed like successfully'})
        })
    })
  }
}

module.exports = likeController