const { Like, User, Tweet } = require('../models')

const likeController = {
  addLike: (req, res, next) => {
    const tweetId = req.params.id
    return Promise.all([
      Tweet.findByPk(tweetId),
      Like.findOne({
        where: {
          userId: req.user.id,
          tweetId
        }
      })
    ])
      .then(([tweet, like]) => {
        if (!tweet) throw new Error("Tweet didn't exist!")
        if (like) throw new Error('You have Liked this restaurant!')
        return Like.create({
          userId: req.user.id,
          tweetId
        })
      })
      .then(like => res.status(200).json(like))
      .catch(err => next(err))
  },
  // POST /tweets/:id/unlike
  removeLike: (req, res, next) => {
    return Like.findOne({
      where: {
        userId: req.user.id,
        tweetId: req.params.id
      }
    }).then(like => {
      if (!like) throw new Error("You haven't liked this tweet!")
      return like.destroy()
    }).then(unlike => res.status(200).json(unlike))
      .catch(err => next(err))
  }
}

module.exports = likeController
