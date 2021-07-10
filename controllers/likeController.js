const { Like, Tweet, User } = require('../models')

const likeController = {
  addLike: async (req, res, next) => {
    try {
      const like = await Like.findOne({
        where: { TweetId: req.params.id, UserId: req.user.id }
      })
      if (like) {
        return res.json({ status: 'error', message: 'Like 已存在' })
      }
      // Like 不存在，create Like 並將指定 Tweet LikeCounts + 1
      await Like.create({
        UserId: req.user.id,
        TweetId: req.params.id,
      })
      await Tweet.increment('likeCounts', { where: { id: req.params.id } })
      return res.json({ status: 'success', message: '新增喜愛的貼文' })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  removeLike: async (req, res, next) => {
    try {
      const like = await Like.findOne({
        where: { TweetId: req.params.id, UserId: req.user.id }
      })
      if (!like) {
        return res.json({ status: 'error', message: '指定的 Like 不存在' })
      }
      // 找到指定 Like，destroy 並將指定 Tweet LikeCounts - 1
      await like.destroy()
      await Tweet.decrement('likeCounts', { where: { id: req.params.id } })
      return res.json({ status: 'success', message: '已取消喜愛這則貼文' })
    } catch (err) {
      console.log(err)
      next(err)
    }
  }
}

module.exports = likeController