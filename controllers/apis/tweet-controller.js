const { Tweet, Like } = require('../../models')
const helpers = require('../../_helpers')

const tweetController = {
  addLike: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id
      const TweetId = req.params.id
      const tweet = await Tweet.findByPk(TweetId)
      const like = await Like.findOne({ where: { UserId, TweetId } })

      if (!tweet) throw new Error("Tweet didn't exist!")
      if (like) throw new Error('You have liked this tweet!')

      const liked = await Like.create({ UserId, TweetId })
      tweet.isLiked = true
      return res.json({
        status: 'success',
        data: {
          ...tweet.toJSON(),
          isLiked: true
        }
      })
    } catch (err) {
      next(err)
    }
  },
  removeLike: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id
      const TweetId = req.params.id
      const tweet = await Tweet.findByPk(TweetId)
      const liked = await Like.findOne({ where: { UserId, TweetId } })

      if (!tweet) throw new Error("Tweet didn't exist!")
      if (!liked) throw new Error("You haven't Liked this tweet")

      await liked.destroy()
      return res.json({
        status: 'success',
        data: {
          ...tweet.toJSON(),
          isLiked: false
        }
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
