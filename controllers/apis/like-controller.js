const { Like, Tweet, User } = require('../../models')
const helpers = require('../../_helpers')

const likeController = {
  postLike: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req)?.id
      const TweetId = req.params.tId
      const tweet = await Tweet.findByPk(TweetId)
      const user = await User.findByPk(UserId)
      if (!tweet || !user) throw new Error('Tweet or user does not exist!!')

      const like = await Like.findOne({ where: { UserId, TweetId } })
      if (like) throw new Error('Like record already exists!!')

      const data = await Like.create({
        likeUnlike: true,
        UserId,
        TweetId
      })

      return res.json({
        status: 'success',
        data
      })
    } catch (err) {
      next(err)
    }
  },
  postUnlike: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req)?.id
      const TweetId = req.params.tId
      const tweet = await Tweet.findByPk(TweetId)
      const user = await User.findByPk(UserId)
      if (!tweet || !user) throw new Error('Tweet or user does not exist!!')

      const like = await Like.findOne({ where: { UserId, TweetId } })
      if (!like) throw new Error('Like record does not exist!!')

      await like.destroy()

      return res.json({
        status: 'success',
        data: like
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = likeController
