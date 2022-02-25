const { User, Tweet, Like } = require('../models')
const authHelpers = require('../_helpers')

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
      if (!(await Tweet.findByPk(targetTweetId))) {
        error.code = 404
        error.message = '對應推文不存在'
        return next(error)
      }

      // 不允許重複按喜歡 (即為不能用這API重複對同一篇推文表示喜歡)
      const isExistLike = await Like.findOne({
        where: {
          UserId: loginUserId,
          TweetId: targetTweetId
        }
      })

      if (isExistLike) {
        error.code = 403
        error.message = '不可重複對同一篇推文表示喜歡'
        return next(error)
      }

      // 可以按喜歡
      const result = await Like.create({
        UserId: loginUserId,
        TweetId: targetTweetId
      })

      await Tweet.increment('likeCount', { where: { id: targetTweetId }, by: 1 })
      await User.increment('likeCount', { where: { id: loginUserId }, by: 1 })

      return res
        .status(200)
        .json({
          status: 'success',
          message: '成功喜歡推文',
          data: result
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
      if (!(await Tweet.findByPk(targetTweetId))) {
        error.code = 404
        error.message = '對應推文不存在'
        return next(error)
      }
      // 不可取消從未喜歡過的推文
      const isExistLike = await Like.findOne({
        where: {
          UserId: loginUserId,
          TweetId: targetTweetId
        }
      })

      if (!isExistLike) {
        error.code = 403
        error.message = '該推文從未被喜歡，不可取消喜歡'
        return next(error)
      }

      // 可以取消喜歡
      const result = await Like.findOne({
        where: {
          UserId: loginUserId,
          TweetId: targetTweetId
        }
      })
        .then(like => like.destroy())

      await Tweet.decrement('likeCount', { where: { id: targetTweetId }, by: 1 })
      await User.decrement('likeCount', { where: { id: loginUserId }, by: 1 })

      return res
        .status(200)
        .json({
          status: 'success',
          message: '成功取消喜歡推文',
          data: result
        })


    } catch (error) {
      // 系統出錯
      error.code = 500
      console.log('hiii', error)
      return next(error)
    }
  }
}


exports = module.exports = likeController
