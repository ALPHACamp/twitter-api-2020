const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like
const helpers = require('../_helpers')

const tweetController = {
  postTweets: async (req, res) => {
    try {
      const { description } = req.body
      const UserId = helpers.getUser(req).id

      if (!description) {
        return res.json({
          status: 'error',
          message: 'input should not be blank'
        })
      }

      if (description.length > 140) {
        return res.json({
          status: 'error',
          message: 'input should be less than 140 characters'
        })
      }

      await Tweet.create({
        UserId,
        description,
        createdAt: new Date(),
        updatedAt: new Date()
      })

      const tweet = await Tweet.findAll({
        raw: true,
        nest: true,
        limit: 1,
        order: [['createdAt', 'DESC']]
      })

      return res.status(200).json({
        status: 'success',
        message: 'successfully posted a tweet',
        tweet
      })
    } catch (error) {
      console.log(error)
    }
  },
  getTweets: async (req, res) => {
    try {
      let tweets = await Tweet.findAll({
        include: [User, Reply, Like]
      })

      tweets = tweets.map(tweet => ({
        id: tweet.id,
        UserId: tweet.UserId,
        description: tweet.description,
        createdAt: tweet.createdAt,
        updatedAt: tweet.updatedAt,
        replyCount: tweet.Replies.length,
        likeCount: tweet.Likes.length,
        user: {
          avatar: tweet.User.avatar,
          name: tweet.User.name,
          account: tweet.User.account
        }
      }))
      return res.json({
        status: 'success',
        message: 'successfully retrieved tweets data',
        tweets
      })
    } catch (error) {
      console.log(error)
    }
  },

  getTweet: async (req, res) => {
    try {
      const TweetId = req.params.id
      const tweet = await Tweet.findByPk(TweetId)
      return res.json({
        status: 'success',
        message: 'successfully retrieved tweet data',
        tweet
      })
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = tweetController
