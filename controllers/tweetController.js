const helpers = require('../_helpers')

const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like

const tweetController = {
  readTweets: (req, res, next) => {
    Tweet.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, attributes: ['id', 'account', 'name', 'avatar'] },
        { model: Like, attributes: ['TweetId', 'UserId'] },
        { model: Reply, attributes: ['TweetId'] }
      ]
    })
      .then(tweets => {
        const userId = helpers.getUser(req).id
        tweets = tweets.map(tweet => ({
          ...Object.keys(tweet.dataValues)
            .slice(0, 6)
            .reduce((result, key) => {
              result[key] = tweet[key]
              return result
            }, {}),
          isLiked: tweet.Likes.map(l => l.UserId).includes(userId),
          repliedCount: tweet.Replies.length,
          LikeCount: tweet.Likes.length,
          isSelf: tweet.UserId === userId
        }))
        return res.json(tweets)
      })
      .catch(next)
  },
  postTweet: (req, res, next) => {
    const { description } = req.body
    if (!description || description.length > 140) {
      return res.status(400).json({ message: 'number of the words must between 1 ~ 140' })
    } else {
      Tweet.create({
        description: description,
        UserId: helpers.getUser(req).id
      })
        .then(tweet => {
          return res.json({ status: 'success', message: 'tweet was successfully created', tweet })
        })
        .catch(next)
    }
  },
  readTweet: (req, res, next) => {
    Tweet.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['id', 'account', 'name', 'avatar'] },
        { model: Reply, attributes: ['TweetId'] },
        { model: Like, attributes: ['TweetId', 'UserId'] }
      ]
    })
      .then(tweet => {
        if (!tweet) {
          return res.status(400).json({ message: 'tweet not exist' })
        }
        const userId = helpers.getUser(req).id
        tweet = {
          ...Object.keys(tweet.dataValues)
            .slice(0, 6)
            .reduce((result, key) => {
              result[key] = tweet[key]
              return result
            }, {}),
          isLiked: tweet.Likes.map(l => l.UserId).includes(userId),
          repliedCount: tweet.Replies.length,
          LikeCount: tweet.Likes.length,
          isSelf: tweet.UserId === userId
        }
        return res.json(tweet)
      })
      .catch(next)
  },
  updateTweet: (req, res, next) => {
    const { description } = req.body
    Tweet.findByPk(req.params.id)
      .then(tweet => {
        if (!tweet) {
          return res.status(400).json({ message: 'tweet not exist' })
        }
        if (tweet.UserId !== helpers.getUser(req).id) {
          return res.status(403).json({ message: 'permission denied' })
        }
        if (!description || description.length > 140) {
          return res.status(400).json({ message: 'number of the words must between 1 ~ 140' })
        } else {
          return tweet.update({ description: description }).then(tweet => {
            res.json({ status: 'success', message: 'Tweet is updated successfully', tweet })
          })
        }
      })
      .catch(next)
  },
  deleteTweet: (req, res, next) => {
    Tweet.findByPk(req.params.id)
      .then(tweet => {
        if (!tweet) {
          return res.status(400).json({ message: 'tweet not exist' })
        }
        if (tweet.UserId !== helpers.getUser(req).id) {
          return res.status(403).json({ message: 'permission denied' })
        }
        return tweet.destroy().then(tweet => {
          res.json({ status: 'success', message: 'Tweet is delete successfully', tweet })
        })
      })
      .catch(next)
  }
}

module.exports = tweetController
