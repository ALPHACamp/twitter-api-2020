
const { Like, Tweet, User } = require('../../models')
const helpers = require('../../_helpers')
const assert = require('assert')
const tweetController = {

  addLike: async (req, res, next) => {
    const TweetId = req.params.id
    const UserId = helpers.getUser(req).id

    try {
      const [tweet, user] = await Promise.all([
        Tweet.findByPk(TweetId),
        User.findByPk(UserId)
      ])
      assert(tweet, '貼文不存在')
      assert(user, '使用者不存在')

      const like = await Like.findOne({ where: { TweetId, UserId } })
      assert(!like, '不可重複喜歡')

      const liked = await Like.create({ TweetId, UserId })
      return res.status(200).json({
        status: 'success',
        data: liked
      })
    } catch (error) {
      console.log(error.message)
      next(error)
    }
  },
  removeLike: async (req, res, next) => {
    const TweetId = req.params.id
    const UserId = helpers.getUser(req).id

    try {
      const [tweet, user] = await Promise.all([
        Tweet.findByPk(TweetId),
        User.findByPk(UserId)
      ])
      assert(tweet, '貼文不存在')
      assert(user, '使用者不存在')

      const like = await Like.findOne({ where: { TweetId, UserId } })
      assert(like, '不可不重複喜歡')
      const deletedLike = like.destroy()
      return res.status(200).json({
        status: 'success',
        data: deletedLike
      })
    } catch (error) {
      next(error)
    }
  }

}

module.exports = tweetController
