const { json } = require('body-parser')
const db = require('../../models')
const { Tweet, User, Reply, Like, Sequelize } = db
const helpers = require('../../_helpers')
const { Op } = Sequelize

const tweetController = {
  getTweets: async (req, res) => {
    try {
      const data = await Tweet.findAll({
        include: [User, { model: User, as: 'LikedUsers' }],
        order: [['createdAt', 'DESC']]
      })
      const tweets = await data.map((tweet) => ({
        ...tweet.dataValues,
        name: tweet.User.name,
        avatar: tweet.User.avatar,
        account: tweet.User.account,
        isLiked: tweet.LikedUsers.map((i) => i.id).includes(
          helpers.getUser(req).id
        )
      }))
      return res.json(tweets)
    } catch (err) {
      console.log(err)
    }
  },
  postTweet: async (req, res) => {
    try {
      const { description } = req.body
      if (!description.trim()) {
        return res.json({
          status: 'error',
          message: 'Content can NOT be empty!'
        })
      }
      if (description.length > 140) {
        return res.json({
          status: 'error',
          message: 'Content should be within 140 characters!'
        })
      }
      await Tweet.create({
        UserId: helpers.getUser(req).id,
        description
      })
      return res.json({
        status: 'success',
        message: 'Tweet was successfully posted'
      })
    } catch (err) {
      console.log(err)
    }
  },

  getTweet: async (req, res) => {
    try {
      const { id } = req.params
      let tweet = await Tweet.findByPk(id, {
        attributes: [
          'id',
          'UserId',
          'description',
          'createdAt',
          'updatedAt',
          [Sequelize.literal('count(distinct Likes.id)'), 'likeCounts'],
          [Sequelize.literal('count(distinct Replies.id)'), 'replyCounts']
        ],
        include: [
          { model: User, attributes: ['name', 'avatar', 'account'] },
          { model: Reply, attributes: [] },
          { model: Like, attributes: [] }
        ]
      })

      if (!tweet) {
        return res.json({
          status: 'error',
          message: 'Can not find this tweet!'
        })
      }
      tweet = tweet.toJSON()
      tweet.isLiked = req.user.LikedTweets
        ? req.user.LikedTweets.map((like) => like.id).includes(tweet.id)
        : null
      return res.json(tweet)
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = tweetController
