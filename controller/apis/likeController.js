const { sequelize } = require('../../models')
const db = require('../../models')
const _ = require('lodash')
const Tweet = db.Tweet
const Reply = db.Reply
const User = db.User
const Like = db.Like
const helper = require('../../_helpers')

const likeController = {
  postLike: async (req, res) => {
    try {
      await Like.create({
        UserId: helper.getUser(req).id,
        TweetId: req.params.id
      })
      return res.status(200).json({ status: 'success', message: '喜歡成功！' })
    } catch (err) {
      return res.json({ status: 'error', message: err })
    }
  },
  deleteLike: async (req, res) => {
    try {
      await Like.destroy({
        where: {
          UserId: helper.getUser(req).id,
          TweetId: req.params.id
        }
      })
      return res.status(200).json({ status: 'success', message: '成功移除' })
    } catch (err) {
      return res.json({ status: 'error', message: err })
    }
  }
}

module.exports = likeController
