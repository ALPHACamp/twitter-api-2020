const Sequelize = require('sequelize')
const { Tweet, User, Reply } = require('../models')
const { literal } = Sequelize
const moment = require('moment')

const tweetController = {
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      raw: true,
      nest: true,
      include: [User],
      attributes: {
        include: [
          [
            Sequelize.literal('(SELECT COUNT(DISTINCT id) FROM Replies WHERE Replies.tweet_id = Tweet.id)'),
            'repliesCount',
          ]
        ]
      },
    })
      .then(tweet => {
        if (!tweet.length) throw new Error("Tweets didn't exist!")
        return res.status(200).json(tweet)
      })
      .catch(err => next(err))
  },

  getTweet: (req, res, next) => {
    return Tweet.findByPk(req.params.tweet_id, {
      include: [Reply, User],
      attributes: {
        include: [
          [
            Sequelize.literal('(SELECT COUNT(DISTINCT id) FROM Replies WHERE Replies.tweet_id = Tweet.id)'),
            'repliesCount',
          ]
        ]
      },
    })
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
    if (!description) throw new Error('Descrption is required!')
    return Tweet.create({
      userId,
      description
    })
      .then(tweet => res.status(200).json(tweet))
      .catch(err => next(err))
  },
  editTweet: (req, res, next) => {
    const tweetId = req.params.tweet_id
    const userId = req.user.id
    return Tweet.findByPk(tweetId, {
      raw: true,
      nest: true
    })
    .then(tweet => {
      if (!tweet) throw new Error("The tweet didn't exist!")
      if (tweet.userId !== userId) {
        throw new Error('You are not authorized to edit this tweet!')
      }
      return res.status(200).json(tweet)
    })
    .catch(err => next(err))
  },
  putTweet: (req, res, next) => {
    const tweetId = req.params.tweet_id
    const userId = req.user.id
    return Tweet.findByPk(tweetId)
    .then(tweet => {
      if (!tweet) {
        throw new Error('Tweet not found!')
      }
      if (tweet.userId !== userId) {
        throw new Error('You are not authorized to edit this tweet!')
      }
      if (!req.body.description) throw new Error('Description is required!')
      
      return tweet.update({
        description: req.body.description
      })
    })
    .then(updatedTweet => {
      res.status(200).json(updatedTweet)
    })
    .catch(err => next(err))
  },
  deletedTweet: (req, res, next) => {
    const tweetId = req.params.tweet_id
    const userId = req.user.id
    return Tweet.findByPk(tweetId)
    .then(tweet => {
      if (!tweet) {
        throw new Error('Tweet not found!')
      }
      if (tweet.userId !== userId) {
        throw new Error('You are not authorized to delete this tweet!')
      }
      
      return tweet.destroy()
    })
    .then(deletedTweet => {
      res.status(200).json(deletedTweet)
    })
    .catch(err => next(err))
  }
}

module.exports = tweetController
