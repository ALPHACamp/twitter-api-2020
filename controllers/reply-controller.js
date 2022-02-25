
const { User, Tweet, Reply } = require('../models')

const replyController = {
  getReplies: async (req, res, next) => {

    try {
      const error = new Error()
      const targetTweetId = req.params.id

      // 找不到推文
      if (!(await Tweet.findByPk(targetTweetId))) {
        error.code = 404
        error.message = '對應推文不存在'
        return next(error)
      }

      const replies = await Reply.findAll({
        where: { TweetId: targetTweetId },
        include: [
          { model: User, as: 'ReplyAuthor' },
          { model: Tweet, include: { model: User, as: 'TweetAuthor' }, as: 'TargetTweet' }
        ],
        nest: true
      })

      const results = replies.map(item => item.toJSON())

      return res
        .status(200)
        .json(results)

    } catch (error) {
      // 系統出錯
      error.code = 500
      return next(error)
    }
  }
}

exports = module.exports = replyController
