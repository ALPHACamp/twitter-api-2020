const { Tweet, User, Reply } = require('../models')
const Sequelize = require('sequelize')
const { literal } = Sequelize
const moment = require('moment')

const tweetController = {
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      raw: true,
      nest: true,
      include: [{
        model: User,
        attributes: {
        exclude: [ 'password', 'role'],
        
        }
      }, 
    ],
      attributes: { 
        exclude: ['UserId'],
        include: [
          [literal('(SELECT COUNT(DISTINCT id) FROM Replies WHERE Replies.tweet_id = Tweet.id)'), 'replyCount'],
        ]
     },
    })
    .then(tweets => {
        if (!tweets) throw new Error("All tweets didn't exist!")
        return res.status(200).json(tweets);
      })
    .catch(err => next(err))
  },

  getTweet: (req, res, next) => {
    return Tweet.findByPk(req.params.tweet_id, {
      include: [{
        model: User,
        attributes: {
        exclude: [ 'password', 'role'],
        }
      }, 
    ],
      attributes: { 
        exclude: ['UserId'],
        include: [
          [literal('(SELECT COUNT(DISTINCT id) FROM Replies WHERE Replies.tweet_id = Tweet.id)'), 'replyCount'],
        ]
     },
    })
    .then(tweet => {
      if (!tweet) throw new Error("The tweet didn't exist!")
      return res.status(200).json(tweet)
    })
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
  }
}

module.exports = tweetController
