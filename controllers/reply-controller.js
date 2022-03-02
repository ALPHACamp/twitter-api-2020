
const {
  User, Tweet,
  Reply, sequelize
} = require('../models')
const authHelpers = require('../_helpers')

const replyController = {
  // 獲取指定推文下的所有回覆(含回覆作者、推文作者)
  getReplies: async (req, res, next) => {

    try {
      const error = new Error()
      const targetTweetId = req.params.id

      // 找不到推文
      if (isNaN(targetTweetId) || !(await Tweet.findByPk(targetTweetId))) {
        error.code = 404
        error.message = '對應推文不存在'
        return next(error)
      }

      // 獲取回覆
      const replies = await Reply.findAll({
        where: { TweetId: targetTweetId },
        include: [
          { model: User, as: 'ReplyAuthor' },
          { model: Tweet, include: { model: User, as: 'TweetAuthor' }, as: 'TargetTweet' }
        ],
        order: [
          ['createdAt', 'DESC']
        ],
        nest: true
      })

      // 清除敏感性資料
      const results = replies.map(item => {
        const result = item.toJSON()
        delete result.ReplyAuthor.password
        delete result.TargetTweet.TweetAuthor.password
        return result
      })

      return res
        .status(200)
        .json(results)

    } catch (error) {
      // 系統出錯
      error.code = 500
      return next(error)
    }
  },
  postReplies: async (req, res, next) => {
    try {
      const error = new Error()
      const { comment } = req.body
      const loginUserId = authHelpers.getUser(req).id
      const targetTweetId = req.params.id


      // 找不到推文
      if (isNaN(targetTweetId) || !(await Tweet.findByPk(targetTweetId))) {
        error.code = 404
        error.message = '對應推文不存在'
        return next(error)
      }

      // 回覆不能為空
      if (!comment) {
        error.code = 400
        error.message = '回覆文字不能為空白'
        return next(error)
      }

      // 回覆字數限制在 140 字以內
      if (comment.length > 140) {
        error.code = 400
        error.message = '回覆字數限制在 140 字以內'
        return next(error)
      }
      // 增加回覆
      const data = await sequelize.transaction(async transaction => {

        const [result] = await Promise.all([
          // 新增推文的回覆
          Reply.create({
            UserId: loginUserId,
            TweetId: targetTweetId,
            comment
          }, { transaction }),
          // 替當前推文增加回覆數
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
          message: '成功發表回覆',
          data
        })
    } catch (error) {
      error.code = 500
      return next(error)
    }
  }
}

exports = module.exports = replyController
