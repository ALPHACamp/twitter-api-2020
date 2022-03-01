const authHelpers = require('../_helpers')
const {
  User, Tweet,
  Like, sequelize
} = require('../models')

const likeController = {
  // 以目前使用者來對某個推文表示喜歡 API
  postTweetLike: async (req, res, next) => {
    // params => tweetid
    // id => getUser
    try {
      const error = new Error()
      const targetTweetId = req.params.id
      const loginUserId = authHelpers.getUser(req).id

      // 找不到推文可以按喜歡
      if (isNaN(targetTweetId) || !(await Tweet.findByPk(targetTweetId))) {
        error.code = 404
        error.message = '對應推文不存在'
        return next(error)
      }

      const data = await sequelize.transaction(async transaction => {
        // 不允許重複按喜歡 (即為不能用這API重複對同一篇推文表示喜歡)
        const isExistLike = await Like.findOne({
          where: { UserId: loginUserId, TweetId: targetTweetId },
          transaction
        })

        if (isExistLike) {
          error.code = 403
          error.message = '不可重複對同一篇推文表示喜歡'
          return next(error)
        }

        // 可以按喜歡
        const [result] = await Promise.all([
          // 建立喜歡推文關係
          Like.create({ UserId: loginUserId, TweetId: targetTweetId }, { transaction }),
          // 增加推文的喜歡數
          Tweet.increment('likeCount', {
            where: { id: targetTweetId },
            by: 1, transaction
          }),
          // 增加使用者的喜歡推文數
          User.increment('likeCount', {
            where: { id: loginUserId },
            by: 1, transaction
          })
        ])

        return result

      })
      return res
        .status(200)
        .json({
          status: 'success',
          message: '成功喜歡推文',
          data
        })


    } catch (error) {
      // 系統出錯
      error.code = 500
      return next(error)
    }

  },
  // 以目前使用者來對某個推文撤銷原本的喜歡 API
  postTweetUnlike: async (req, res, next) => {


    try {
      const error = new Error()
      const targetTweetId = req.params.id
      const loginUserId = authHelpers.getUser(req).id

      // 找不到推文可以取消喜歡
      if (isNaN(targetTweetId) || !(await Tweet.findByPk(targetTweetId))) {
        error.code = 404
        error.message = '對應推文不存在'
        return next(error)
      }


      const data = await sequelize.transaction(async transaction => {
        // 不可取消從未喜歡過的推文
        const isExistLike = await Like.findOne({
          where: { UserId: loginUserId, TweetId: targetTweetId },
          transaction
        })

        if (!isExistLike) {
          error.code = 403
          error.message = '該推文從未被喜歡，不可取消喜歡'
          return next(error)
        }

        const targetLike = await Like.findOne({
          where: { UserId: loginUserId, TweetId: targetTweetId },
          transaction
        })
        // 可以取消喜歡
        await Promise.all([
          // 刪除喜歡的推文
          targetLike.destroy({ transaction }),
          // 減少推文的喜歡數
          Tweet.decrement('likeCount', {
            where: { id: targetTweetId }, by: 1,
            transaction
          }),
          // 減少使用者的喜歡數
          User.decrement('likeCount', {
            where: { id: loginUserId }, by: 1,
            transaction
          })

        ])

        return targetLike.toJSON()

      })

      return res
        .status(200)
        .json({
          status: 'success',
          message: '成功取消喜歡推文',
          data
        })


    } catch (error) {
      // 系統出錯
      error.code = 500
      return next(error)
    }
  }
}


exports = module.exports = likeController
