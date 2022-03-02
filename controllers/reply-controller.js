const { User, Tweet, Reply, sequelize } = require('../models')
const helpers = require('../_helpers')

const replyController = {
  getReplies: async (req, res, next) => {
    try {
      const TweetId = req.params.id
      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) throw new Error('tweet_id does not exist.')
      const replies = await Reply.findAll({
        include: [
          {
            model: User,
            attributes: { exclude: ['password'] }
          }
        ],
        where: {
          TweetId
        },
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']]
      })
      return res.status(200).json(replies)
    } catch (err) {
      next(err)
    }
  },
  postReplies: async (req, res, next) => {
    try {
      const { comment } = req.body
      const loginUserId = helpers.getUser(req).id
      const targetTweetId = req.params.id

      if (isNaN(targetTweetId) || !(await Tweet.findByPk(targetTweetId))) {
        return res.status(404).json({
          status: 'error',
          message: '此推文不存在'
        })
      }

      // 回覆不能為空
      if (!comment) {
        return res.status(400).json({
          status: 'error',
          message: '回覆不能空白'
        })
      }

      // 增加回覆
      const data = await sequelize.transaction(async transaction => {
        const [result] = await Promise.all([
          Reply.create({
            UserId: loginUserId,
            TweetId: targetTweetId,
            comment
          }, { transaction }),
          Tweet.increment('replyCount', {
            where: { id: targetTweetId },
            transaction
          })
        ])
        return result
      })

      return res
        .status(200)
        .json({
          status: 'success',
          data,
          message: '成功發表回覆'
        })
    } catch (err) { next(err) }
  }
}

exports = module.exports = replyController
