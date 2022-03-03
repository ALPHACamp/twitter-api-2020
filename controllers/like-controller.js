const helpers = require('../_helpers')
const { User, Tweet, Like, sequelize } = require('../models')

const likeController = {
  postTweetLike: async (req, res, next) => {
    // params => tweetid
    // id => getUser
    try {
      const targetTweetId = req.params.id
      const loginUserId = helpers.getUser(req).id

      if (isNaN(targetTweetId) || !(await Tweet.findByPk(targetTweetId))) {
        return res.status(404).json({
          status: 'error',
          message: '此推文不存在'
        })
      }

      const data = await sequelize.transaction(async transaction => {
        const isExistLike = await Like.findOne({
          where: { UserId: loginUserId, TweetId: targetTweetId },
          transaction
        })
        if (isExistLike) {
          return res.status(403).json({
            status: 'error',
            message: '不可重複對同一篇推文表示喜歡'
          })
        }
        const [postedLike] = await Promise.all([
          Like.create({ UserId: loginUserId, TweetId: targetTweetId }, { transaction }),
          Tweet.increment('likeCount', { where: { id: targetTweetId }, by: 1, transaction }),
          User.increment('likeCount', { where: { id: loginUserId }, by: 1, transaction })
        ])
        return postedLike
      })
      return res.status(200)
        .json({
          status: 'success',
          data,
          message: '成功喜歡推文'
        })
    } catch (err) { next(err) }
  },
  postTweetUnlike: async (req, res, next) => {
    try {
      const targetTweetId = req.params.id
      const loginUserId = helpers.getUser(req).id

      if (isNaN(targetTweetId) || !(await Tweet.findByPk(targetTweetId))) {
        return res.status(404).json({
          status: 'error',
          message: '推文不存在'
        })
      }

      const data = await sequelize.transaction(async transaction => {
        // 不可取消從未喜歡過的推文
        const isExistLike = await Like.findOne({
          where: { UserId: loginUserId, TweetId: targetTweetId },
          transaction
        })

        if (!isExistLike) {
          return res.status(404).json({
            status: 'error',
            message: '不能對尚未按讚的推文收回讚!'
          })
        }

        const targetLike = await Like.findOne({ where: { UserId: loginUserId, TweetId: targetTweetId }, transaction })
        // 可以取消喜歡
        await Promise.all([
          targetLike.destroy({ transaction }),
          Tweet.decrement('likeCount', { where: { id: targetTweetId }, by: 1, transaction }),
          User.decrement('likeCount', { where: { id: loginUserId }, by: 1, transaction })
        ])

        return targetLike.toJSON()
      })

      return res.status(200)
        .json({
          status: 'success',
          data,
          message: '成功取消喜歡推文'
        })
    } catch (err) { next(err) }
  }
}

module.exports = likeController
