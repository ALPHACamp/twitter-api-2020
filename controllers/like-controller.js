const { Like } = require('../models')
const helpers = require('../_helpers')

const likeController = {
  likeTweet: (req, res, next) => {
    const UserId = helpers.getUser(req).id
    const TweetId = Number(req.params.id)

    return Like.findOne({
      where: {
        UserId,
        TweetId
      },
      raw: true
    })
      .then(like => {
        if (like) throw new Error('You are already liked this tweet!')
        return Like.create({
          UserId,
          TweetId
        })
      })
      .then(like => {
        res.status(200).json(like)
      })
      .catch(err => next(err))
  },
  unlikeTweet: (req, res, next) => {
    const UserId = helpers.getUser(req).id
    const TweetId = Number(req.params.id)

    return Like.findOne({
      where: {
        UserId,
        TweetId
      }
    })
      .then(like => {
        if (!like) throw new Error('You have not liked this tweet!')
        return like.destroy()
      })
      .then(like => {
        res.status(200).json(like)
      })
      .catch(err => next(err))
  }
}
module.exports = likeController