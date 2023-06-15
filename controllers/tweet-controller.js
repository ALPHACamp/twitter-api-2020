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
        exclude: ['createdAt', 'updatedAt', 'password', 'role'],
        include: [
          [Sequelize.literal('DATE_FORMAT(User.created_at, "%Y-%m-%d %H:%i:%s")'), 'createdAt'],
          [Sequelize.literal('DATE_FORMAT(User.updated_at, "%Y-%m-%d %H:%i:%s")'), 'updatedAt']
          ]
        }
      }, 
      // {
      //   model: Reply,
      //   attributes: {
      //   exclude: ['UserId', 'TweetId', 'createdAt', 'updatedAt'], // 排除原始的 createdAt 和 updatedAt
      //   include: [
      //     [Sequelize.literal('DATE_FORMAT(Replies.created_at, "%Y-%m-%d %H:%i:%s")'), 'createdAt'],
      //     [Sequelize.literal('DATE_FORMAT(Replies.updated_at, "%Y-%m-%d %H:%i:%s")'), 'updatedAt']
      //     ]
      //   }
      // }
    ],
      attributes: { 
        exclude: ['UserId', 'createdAt', 'updatedAt'],
        include: [
          [literal('(SELECT COUNT(DISTINCT id) FROM Replies WHERE Replies.tweet_id = Tweet.id)'), 'replyCount'],
          [Sequelize.literal('DATE_FORMAT(Tweet.created_at, "%Y-%m-%d %H:%i:%s")'), 'createdAt'],
          [Sequelize.literal('DATE_FORMAT(Tweet.updated_at, "%Y-%m-%d %H:%i:%s")'), 'updatedAt']
        ]
     },
    })
    .then(tweets => {
      const modifiedTweets = tweets.map(tweet => {
        // const modifiedReplies = tweets
          // .filter(t => t.id === tweet.id)
          // .map(t => t.Replies);

        return {
          ...tweet,
          // Replies: modifiedReplies
        };
      });

      return res.status(200).json(modifiedTweets);
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
