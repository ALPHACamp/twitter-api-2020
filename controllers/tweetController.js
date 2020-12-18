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
        tweets = tweets.map(tweet => ({
          ...Object.keys(tweet.dataValues)
            .slice(0, 6)
            .reduce((result, key) => {
              result[key] = tweet[key]
              return result
            }, {}),
          isLiked: tweet.Likes.map(l => l.UserId).includes(helpers.getUser(req).id),
          repliesCount: tweet.Replies.length,
          likesCount: tweet.Likes.length
        }))
        return res.json(tweets)
      })
      .catch(next)
  },
  postTweet: (req, res, next) => {
    const { description } = req.body
    if (!description) {
      return res.status(400).json({ status: 'failure', message: "description didn't exist" })
    } else if (description.length > 140) {
      return res.status(409).json({ status: 'failure', message: 'number of the words must between 1 ~ 140' })
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
        tweet = {
          ...Object.keys(tweet.dataValues)
            .slice(0, 6)
            .reduce((result, key) => {
              result[key] = tweet[key]
              return result
            }, {}),
          isLiked: tweet.Likes.map(l => l.UserId).includes(helpers.getUser(req).id),
          repliesCount: tweet.Replies.length,
          likesCount: tweet.Likes.length
        }

        return res.json(tweet)
      })
      .catch(next)
  }
}

module.exports = tweetController
