const { Tweet, Like } = require("../models")
const { getUser } = require("../_helpers")

const likeController = {

postTweetLike: (req, res, next) => {
    const UserId = getUser(req).id
    const TweetId = req.params.id
    return Promise.all([
      Tweet.findByPk(TweetId),
      Like.findOne({
        where: {
          UserId,
          TweetId,
        }
      })
    ])
      .then(([tweet, like]) => {
        if (!tweet) throw new Error("Tweet doesn't exist!")
        if (like) throw new Error("You have liked this tweet!")

        return Like.create({
          UserId,
          TweetId,
        })
      })
      .then((newLike) => {
        return res
          .status(200)
          .json({ status: "success", message: "Like succeed", newLike })
      })
      .catch((err) => next(err))
  },

  postTweetUnlike: (req, res, next) => {
    const TweetId = req.params.id
    return Promise.all([
      Tweet.findByPk(TweetId),
      Like.findOne({
        where: {
          TweetId,
        },
      }),
    ])
      .then(([tweet, like]) => {
        if (!tweet) throw new Error("Tweet doesn't exist!")
        if (!like) throw new Error("You haven't liked this tweet!")

        // keep the deleted data
        const deletedLike = like.toJSON()
        return like.destroy().then(() => {
          return res.status(200).json({
            status: "success",
            message: "Unlike succeed",
            deletedLike,
          })
        })
      })
      .catch((err) => next(err))
  }
}
module.exports = likeController