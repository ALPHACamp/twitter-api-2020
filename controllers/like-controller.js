const { User, Tweet, Like } = require('../models')
const authHelpers = require('../_helpers')

const likeController = {
  // 以目前使用者來對某個推文表示喜歡 API
  postTweetLike: async (req, res, next) => {
    // params => tweetid
    // id => getUser
    try {
      const error = new Error()
      const tweetId = req.params.id
      const userId = authHelpers.getUser(req).id

      const targetTweet = await Tweet.findByPk(tweetId)
      const loginUser = await User.findByPk(userId)
      // 找不到推文可以按喜歡
      if (!targetTweet) {
        error.code = 404
        error.message = '對應推文不存在'
        return next(error)
      }

      // 不允許重複按喜歡 (即為不能用這API重複對同一篇推文表示喜歡)
      const isExistLike = await Like.findOne({
        where: {
          UserId: userId,
          TweetId: tweetId
        }
      })

      if (isExistLike) {
        error.code = 403
        error.message = '不可重複對同一篇推文表示喜歡'
        return next(error)
      }

      // 可以按喜歡
      await targetTweet.increment('likeCount', { by: 1 })
      await loginUser.increment('likeCount', { by: 1 })
      const result = await Like.create({
        UserId: userId,
        TweetId: tweetId
      })

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
      const tweetId = req.params.id
      const userId = authHelpers.getUser(req).id

      const targetTweet = await Tweet.findByPk(tweetId)
      const loginUser = await User.findByPk(userId)

      // 找不到推文可以取消喜歡
      if (!targetTweet) {
        error.code = 404
        error.message = '對應推文不存在'
        return next(error)
      }
      // 不可取消從未喜歡過的推文
      const isExistLike = await Like.findOne({
        where: {
          UserId: userId,
          TweetId: tweetId
        }
      })

      if (!isExistLike) {
        error.code = 403
        error.message = '該推文從未被喜歡，不可取消喜歡'
        return next(error)
      }

      // 可以取消喜歡
      await targetTweet.decrement('likeCount', { by: 1 })
      await loginUser.decrement('likeCount', { by: 1 })

      const result = await Like.findOne({
        where: {
          UserId: userId,
          TweetId: tweetId
        }
      })
        .then(like => like.destroy())

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
      return next(error)
    }
  }
}


exports = module.exports = likeController
