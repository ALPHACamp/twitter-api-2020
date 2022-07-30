const { User, Like, Tweet } = require('../models')
const helpers = require('../_helpers')

const likeController = {
  addLike: async (req, res, next) => {
    try {
      const tweetId = Number(req.params.id)
      const userId = Number(helpers.getUser(req).id)
      const tweet = await Tweet.findByPk(tweetId)
      const user = await User.findByPk(userId)
      if (!tweet || !user) {
        return res.status(500).json({
          status: 'error',
          message: '找不到推文或使用者'
        })
      }

      const like = await Like.findOne({
        where: { UserId: userId, TweetId: tweetId }
      })

      if (like) {
        return res.status(500).json({
          status: 'error',
          message: '已經喜歡過此推文'
        })
      }

      const data = await Like.create({
        UserId: userId,
        TweetId: tweetId
      })

      return res.status(200).json({
        status: 'success',
        message: '成功喜歡此推文!',
        data
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = likeController
