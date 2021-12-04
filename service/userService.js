const db = require('../models')
const Tweet = db.Tweet
const Reply = db.Reply
const User = db.User
const Like = db.Like
const helpers = require('../_helpers')

const userService = {
  addLike: (req, res, callback) => {
    return Like.create({
      UserId: helpers.gerUser(req).id,
      TweetId: req.params.tweetId
    }).then(() => {
      return callback({ status: 'success', message: '' })
    })
  },

  removeLike: (req, res, callback) => {
    return Like.findOne({
      where: {
        UserId: helpers.gerUser(req).id,
        TweetId: req.params.tweetId
      }
    }).then((like) => {
      like.destroy()
        .then(() => {
          return callback({ status: 'success', message: '' })
        })
    })
  },
}

module.exports = userService