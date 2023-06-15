const { Tweet, User, Reply } = require('../models')
const Sequelize = require('sequelize')
const moment = require('moment')

const tweetController = {
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      raw: true,
      nest: true,
      include: [{
        model: User,
        attributes: {
        exclude: ['createdAt', 'updatedAt', 'password', 'role'], // 排除原始的 createdAt 和 updatedAt
        include: [
          [Sequelize.literal('DATE_FORMAT(User.created_at, "%Y-%m-%d %H:%i:%s")'), 'formattedCreatedAt'],
          [Sequelize.literal('DATE_FORMAT(User.updated_at, "%Y-%m-%d %H:%i:%s")'), 'formattedUpdatedAt']
          ]
        }
      }, {
        model: Reply,
        attributes: {
        exclude: ['UserId', 'TweetId', 'createdAt', 'updatedAt'], // 排除原始的 createdAt 和 updatedAt
        include: [
          [Sequelize.literal('DATE_FORMAT(Replies.created_at, "%Y-%m-%d %H:%i:%s")'), 'formattedCreatedAt'],
          [Sequelize.literal('DATE_FORMAT(Replies.updated_at, "%Y-%m-%d %H:%i:%s")'), 'formattedUpdatedAt']
          ]
        }
      }],
      attributes: { 
        exclude: ['UserId'],
        include: [
          Sequelize.literal('(SELECT COUNT(DISTINCT id) FROM Replies WHERE Replies.tweet_id = Tweet.id)'), 'replyCount'
        ]
     },
    })
    .then(tweet => {
      const modifyTweet = tweet.map((tweets) => {
        const createdAt = moment(tweets.createdAt).format('YYYY-MM-DD HH:mm:ss')
        const updatedAt = moment(tweets.updatedAt).format('YYYY-MM-DD HH:mm:ss')
        
        return {
          ...tweets,
          createdAt,
          updatedAt,
          }
      })
      return res.status(200).json(modifyTweet)
    })
    .catch(err => next(err))
  },
  getTweet: (req, res, next) => {
    return Tweet.findByPk(req.params.tweet_id)
    .then(tweet => {
      if (!tweet) throw new Error("The tweet didn't exist!")
      return tweet
    })
    .then(tweet => res.status(200).json(tweet))
    .catch(err => next(err))
  },
  createTweet: (req, res, next) => {
    const { description } = req.body
    const userId = req.user.id
    if (!description) throw new Error('Descrption text is required!')
    return Tweet.create({
      userId,
      description
    })
    .then(tweet => res.status(200).json(tweet))
    .catch(err => next(err))
  }
}

module.exports = tweetController
