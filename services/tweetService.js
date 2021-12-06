const helpers = require('../_helpers')
const sequelize = require('sequelize')
const { Tweet, Reply, Like, User } = require('../models')

const tweetService = {
  getTweets: (req, res, callback) => {
    return Tweet.findAll({
      attributes: [
        'id',
        'UserId',
        'description',
        'createdAt',
        [sequelize.literal(`(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)`), 'replyCount'],
        [sequelize.literal(`(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)`), 'likeCount']
      ],
      include: [
        { model: Reply, attributes: ['id'] },
        { model: Like, attributes: ['id'] },
        { model: User, attributes: ['id', 'name', 'account', 'avatar'] }
      ],
      order: [['createdAt', 'DESC']]
    }).then(tweets => {
      tweets = tweets.map(tweet => ({
        ...tweet.toJSON(),
        isLiked: Number(helpers.getUser(req).id) === Number(tweet.UserId)
      }))
      return callback({ tweets })
    })
  },

  postTweet: (req, res, callback) => {
    try {
      return Tweet.create({ UserId: helpers.getUser(req).id, description: req.body.description }).then(tweet => {
        callback({ status: 'success', message: '發文成功！' })
      })
    } catch (err) {
      console.log(err)
      return callback({ status: 'error', message: '發文失敗！' })
    }
  },

  getTweet: (req, res, callback) => {
    Tweet.findByPk(req.params.tweet_id, {
      attributes: [
        'id',
        'UserId',
        'description',
        'createdAt',
        [sequelize.literal(`(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)`), 'replyCount'],
        [sequelize.literal(`(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)`), 'likeCount']
      ],
      include: [
        {
          model: Reply,
          include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar'] }]
        },
        { model: Like },
        { model: User, attributes: ['id', 'name', 'account', 'avatar'] }
      ]
    }).then(tweet => {
      tweet = tweet.toJSON()
      tweet['isLiked'] = Number(helpers.getUser(req).id) === Number(tweet.UserId)

      return callback({ tweet })
    })
  },

  likeTweet: (req, res, callback) => {
    Like.create({
      UserId: helpers.getUser(req).id,
      TweetId: req.params.tweet_id
    }).then(() => {
      return callback({ status: 'success', message: '已讚！' })
    })
  },

  unlikeTweet: (req, res, callback) => {
    Like.destroy({
      where: {
        UserId: helpers.getUser(req).id,
        TweetId: req.params.tweet_id
      }
    }).then(() => {
      return callback({ status: 'success', message: '收回讚！' })
    })
  }
}

module.exports = tweetService
