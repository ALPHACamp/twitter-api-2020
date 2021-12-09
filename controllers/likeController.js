const { Like } = require('../models')
const helpers = require('../_helpers')

const likeController = {
  postUnlike: async (req, res) => {
    try {
      await Like.destroy({ where: { TweetId: Number(req.params.id), UserId: Number(helpers.getUser(req).id) } })
      return res.status(200).json({ status: 'success', message: '成功取消喜歡' })
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
