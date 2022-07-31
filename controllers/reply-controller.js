const { User, Tweet, Reply } = require('../models')
const helpers = require('../_helpers')

const replyController = {
  postReply: async (req, res, next) => {
    try {
      const { comment } = req.body
      if (!comment) {
        return res.status(500).json({
          status: 'error',
          message: '未找到推文!'
        })
      }

      const userId = Number(helpers.getUser(req).id)
      const tweetId = Number(req.params.tweet_id)
      const user = await User.findByPk(userId)
      const tweet = await Tweet.findByPk(tweetId)

      if (!user || !tweet) {
        return res.status(500).json({
          status: 'error',
          message: '找不到推文或使用者!'
        })
      }

      const data = await Reply.create({
        comment,
        UserId: userId,
        TweetId: tweetId
      })

      return res.status(200).json({
        status: 'success',
        message: '成功新增一則回覆!',
        data
      })
    } catch (err) {
      next(err)
    }
  },
  getReply: async (req, res, next) => {
    try {
      const TweetId = Number(req.params.tweet_id)
      const tweet = await Tweet.findByPk(TweetId)

      if (!tweet) {
        return res.status(500).json({
          status: 'error',
          message: '找不到推文!'
        })
      }

      const data = await Reply.findAll({
        where: { TweetId },
        attributes: ['id', 'comment', 'createdAt', 'updatedAt'],
        include: [
          {
            model: User,
            attributes: ['id', 'account', 'name', 'avatar']
          }
        ],
        order: [['createdAt', 'DESC']]
      })

      return res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = replyController
