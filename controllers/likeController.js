const { Like, Tweet } = require('../models')

const helpers = require('../_helpers')

module.exports = {
  createLike: async (req, res, next) => {
    try {
      const id = req.params.id
      const tweet = await Tweet.findByPk(id)
      if (!tweet) {
        return res.json({ status: 'error', message: '找不到推文' })
      }
      const like = await Like.findOne({
        where: { UserId: helpers.getUser(req).id, TweetId: tweet.id }
      })
      if (like) {
        return res.json({ status: 'error', message: '操作重複' })
      }
      await Like.create({ UserId: helpers.getUser(req).id, TweetId: tweet.id })
      return res.json({
        status: 'success',
        message: '推文按讚成功'
      })
    } catch (err) {
      next(err)
    }
  },
  deleteLike: async (req, res, next) => {
    try {
      const id = req.params.id
      const tweet = await Tweet.findByPk(id)
      if (!tweet) {
        return res.json({ status: 'error', message: '找不到推文' })
      }
      const like = await Like.findOne({
        where: { UserId: helpers.getUser(req).id, TweetId: tweet.id }
      })
      if (!like) {
        return res.json({ status: 'error', message: '找不到按讚紀錄' })
      }
      await like.destroy()
      return res.json({
        status: 'success',
        message: '取消推文按讚成功'
      })
    } catch (err) {
      next(err)
    }
  }
}
