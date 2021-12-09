const { sequelize } = require('../../models')
const db = require('../../models')
const Tweet = db.Tweet
const Reply = db.Reply
const User = db.User
const Like = db.Like
const helper = require('../../_helpers')
const tweetController = {
  getTweets: async (req, res) => {
    try {
      const tweets = await Tweet.findAll({
        attributes: {
          include: [
            [
              sequelize.fn(
                'COUNT',
                sequelize.fn('DISTINCT', sequelize.col('Likes.id'))
              ),
              'like_count'
            ],
            [
              sequelize.fn(
                'COUNT',
                sequelize.fn('DISTINCT', sequelize.col('Replies.id'))
              ),
              'reply_count'
            ]
          ]
        },
        include: [
          { model: Like, attributes: [] },
          { model: Reply, attributes: [] },
          { model: User, attributes: ['name', 'account', 'avatar'] }
        ],
        raw: true,
        nest: true,
        group: ['Tweet.id'],
        order: [['createdAt', 'DESC']]
      })
      const likedArray = await Like.findAll({
        where: { UserId: helper.getUser(req).id },
        attributes: ['TweetId'],
        raw: true,
        nest: true
      })
      const likedIdArray = likedArray.map(a => {
        return a.TweetId
      })
      const data = tweets.map(tweet => ({
        ...tweet,
        isLiked: likedIdArray.includes(tweet.id) ? true : false
      }))

      return res.status(200).json([...data])
    } catch (err) {
      console.log(err)
      return res.status(401).json({ status: 'error', message: err })
    }
  },
  getTweet: async (req, res) => {
    try {
      const id = req.params.id
      const tweet = await Tweet.findByPk(id, {
        attributes: {
          include: [
            [
              sequelize.fn(
                'COUNT',
                sequelize.fn('DISTINCT', sequelize.col('Likes.id'))
              ),
              'like_count'
            ],
            [
              sequelize.fn(
                'COUNT',
                sequelize.fn('DISTINCT', sequelize.col('Replies.id'))
              ),
              'reply_count'
            ]
          ]
        },
        include: [
          { model: Like, attributes: [] },
          { model: Reply, attributes: [] },
          { model: User }
        ],
        raw: true,
        nest: true,
        group: ['Tweet.id']
      })
      const like = await Like.findOne({
        where: { UserId: helper.getUser(req).id, TweetId: req.params.id }
      })
      const isLiked = like ? true : false
      return res.status(200).json({ ...tweet, isLiked })
    } catch (err) {
      console.log(err)
      return res.status(401).json({ status: 'error', message: err })
    }
  },
  postTweet: async (req, res) => {
    try {
      if (req.body.description.length > 150) {
        return res.status(400).json({ message: '字數超出上限！' })
      }

      if (req.body.description.trim().length < 1) {
        return res.status(400).json({ message: '內容不可空白' })
      }
      await Tweet.create({
        description: req.body.description,
        UserId: helper.getUser(req).id
      })
      return res.json({ status: 200, message: '' })
    } catch (err) {
      console.error(err)
      return res.status(401).json({ status: 'error', message: err })
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
      if (req.description.length > 150) {
        return res.status(400).json({ message: '字數超出上限！' })
      }
      await Tweet.update(
        { description: req.body.description },
        { where: { id: req.params.id } }
      )
      return res.json({ status: 200, message: '' })
    } catch (err) {
      console.log(err)
      return res.status(401).json({ status: 'error', message: err })
    }
  },
  deleteTweet: async (req, res) => {
    try {
      await Promise.all([
        await Tweet.destroy({ where: { id: req.params.id } }),
        await Reply.destroy({ where: { TweetId: req.params.id } }),
        await Like.destroy({ where: { TweetId: req.params.id } })
      ])
      return res.json({ status: 200, message: 'delete successfully' })
    } catch (err) {
      console.log(err)
      return res.status(401).json({ status: 'error', message: err })
    }
  }
}

module.exports = tweetController
