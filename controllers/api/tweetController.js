const { json } = require('body-parser')
const db = require('../../models')
const { Tweet, User, Reply, Like, Sequelize } = db
const helpers = require('../../_helpers')
const { Op } = Sequelize

const tweetController = {
  getTweets: async (req, res) => {
    try {
      let tweets = await Tweet.findAll({
        attributes: [
          ['id', 'TweetId'],
          'createdAt',
          'description',
          [
            Sequelize.literal(
              '(SELECT COUNT(*) FROM Likes WHERE Likes.tweetId = Tweet.id)'
            ),
            'LikesCount'
          ],
          [
            Sequelize.literal(
              '(SELECT COUNT(*) FROM Replies WHERE Replies.tweetId = Tweet.id)'
            ),
            'RepliesCount'
          ]
        ],
        group: 'TweetId',
        include: [
          { model: User, attributes: ['id', 'name', 'avatar', 'account'] }
        ],
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })
      tweets = tweets.map((tweet) => ({
        ...tweet,
        isLiked: req.user.LikedTweets
          ? req.user.LikedTweets.map((like) => like.id).includes(tweet.TweetId)
          : null
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
