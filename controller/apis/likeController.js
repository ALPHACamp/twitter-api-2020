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
      return res.status(200).json({ message: '喜歡成功！' })
    } catch (err) {
      console.log(err)
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
      return res.status(200).json({ message: '重功移除' })
    } catch (err) {
      console.log(err)
      return res.status(400).json({ message: err })
    }
  }
}

module.exports = likeController
