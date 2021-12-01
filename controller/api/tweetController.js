const helper = require('../../_helpers')
const db = require('../../models')
const sequelize = require('sequelize')
const Tweet = db.Tweet
const User = db.User
const Like = db.Like
const Reply = db.Reply

const tweetController = {
  getTweets: async (req, res) => {
    try {
      const tweets = await Tweet.findAll({ raw: true, nest: true })
      return res.json({tweets, status: 200, message: '' })
    } catch (err) {
      return console.log(err)
    }
  },
  getTweet: async (req, res) => {
    try {
      const id = req.params.id
      const tweet = await Tweet.findByPk(id, {
        raw: true,
        nest: true,
        include: [
          { model: User, attributes: ["id", "name", "account", "avatar"] },
          { model: Like, attributes: [] },
          { model: Reply, attributes: [] }
        ],
        attributes: ["description", "UserId", "createdAt",
          [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('likes.id'))), 'likes_count'], //新增欄位計算like
          [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('replies.id'))), 'replies_count'] //新增欄位計算reply
        ]
      })
      return res.json({ tweet, status: 200, message: '' })
    } catch (err) {
      console.log(err)
    }
  },
  postTweet: async (req, res) => {
    try {
      await Tweet.create({
        description: req.body.description,
        UserId: helper.getUser(req).id
      })
      return res.json({ status: 200, message: '' })
    } catch (err) {
      console.error(err)
    }
  },
  putTweet: async (req, res) => {
    try {
      if (!req.body.description) {
        return res.json({
          status: 'error',
          message: "description didn't exist"
        })
      }
      await Tweet.update(
        { description: req.body.description },
        { where: { id: req.params.id } }
      )
      return res.json({ status: 200, message: '' })
    } catch (err) {
      console.log(err)
    }
  },
  deleteTweet: async (req, res) => {
    try {
      await Tweet.destroy({ where: { id: req.params.id } })
      return res.json({ status: 200, message: 'delete successfully' })
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = tweetController
