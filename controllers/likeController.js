const { Like } = require('../models')
const helpers = require('../_helpers')

const likeController = {
  postUnlike: async (req, res) => {
    try {
      const targetLike = await Like.findOne({ raw: true, nest: true, where: { TweetId: Number(req.params.id) } })
      if (targetLike.UserId === helpers.getUser(req).id) {
        await Like.destroy({ where: { TweetId: Number(req.params.id) } })
        return res.status(200).json({ status: 'success', message: '成功取消喜歡' })
      } else {
        return res.status(401).json({ status: 'error', message: '無法變更其他使用者的Profile' })
      }
    } catch (error) {
      console.log(error)
      return res.status(500).json({ status: 'error', message: 'Server error' })
    }
  },
  likeTweet: async (req, res) => {
    try {
      const id = Number(req.params.id)
      await Like.create({
        UserId: helpers.getUser(req).id,
        TweetId: id
      })
      return res.status(200).json({ status: 'success', message: '成功增加喜歡' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ status: 'error', message: 'Server error' })
    }
  }

}

module.exports = likeController
