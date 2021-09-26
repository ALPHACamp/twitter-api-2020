const db = require('../models')
const { Like, Tweet } = db

const likeService = {
  likeTweet: async (req, res, cb) => {
    try {
      // 檢查是否已經按過讚
      let like = await Like.findOne({
        where: {
          UserId: req.user.id,
          TweetId: req.params.id
        }
      })
      if (like) return cb({ status: '409', message: '已經按過讚' })
      // 檢查推文是否存在，不存在不可按
      const tweet = await Tweet.findByPk(req.params.id)
      if (!tweet) return cb({ status: '400', message: '推文不存在' })
      like = await Like.create({
        UserId: req.user.id,
        TweetId: req.params.id
      })
      return cb({ status: '200', message: '按讚成功', id: like.toJSON().id })
    } catch (err) {
      console.warn(err)
      return cb({ status: '500', message: err })
    }
  },

  unlikeTweet: async (req, res, cb) => {
    try {
      const like = await Like.findOne({ where: { UserId: req.user.id, TweetId: req.params.id } })
      if (like) {
        await like.destroy()
        return cb({ status: '200', message: '成功取消推文讚' })
      }
      return cb({ status: '400', message: '找不到按讚紀錄' })
    } catch (err) {
      console.warn(err)
      return cb({ status: '500', message: err })
    }
  }
}

module.exports = likeService