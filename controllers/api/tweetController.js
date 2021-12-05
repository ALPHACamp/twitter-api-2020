const { json } = require('body-parser')
const db = require('../../models')
const { Tweet, User, Reply, Like, sequelize } = db
const helpers = require('../../_helpers')

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
        return (
          res, json({ status: 'error', message: 'Content can NOT be empty!' })
        )
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
      const tweet = await Tweet.findByPk(req.params.id, {
        include: [
          User,
          { model: User, as: 'LikedUsers' },
          { model: Reply, include: [User] }
        ],
        order: [['Replies', 'createdAt', 'DESC']]
      })
      return res.json(tweet)
    } catch {
      console.log(err)
    }
  }
}

module.exports = tweetController
