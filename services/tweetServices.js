const db = require('../models')
const helpers = require('../_helpers')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like

const tweetServices = {
  getTweets: (req, res, callback) => {
    Tweet.findAll({
      include: [
        User, Like,
        { model: Reply, include: [User] },
      ]
    }).then(tweets => {
      tweets = tweets.map(r => ({
        ...r.dataValues,
        likeTweetCount: r.Likes.length,
        replyTweetCount: r.Replies.length
      }))
      return callback(tweets)
    })
  },
  getTweet: (req, res, callback) => {
    Tweet.findByPk(req.params.tweet_id, {
      include: [
        User
      ]
    }).then(tweet => {
      Reply.findAndCountAll({ include: [User], where: { TweetId: req.params.tweet_id } })
        .then(replies => {
          Like.findAndCountAll({ where: { TweetId: req.params.tweet_id } })
            .then(likes => {
              return callback({ tweet, replies, likes })
            })
        })
    })
  },
  postTweet: (req, res, callback) => {
    const USERID = helpers.getUser(req).id
    if (!req.body.description) {
      return callback({ status: 'error', message: 'Tweet is empty' })
    }
    Tweet.create({
      UserId: USERID,
      description: req.body.description,
    }).then(tweet => {
      return callback({ status: 'success', message: 'Tweet was successfully created' })
    })
  },
  putTweet: (req, res, callback) => {
    if (!req.body.description) {
      return callback({ status: 'error', message: 'Tweet is empty' })
    }
    Tweet.findByPk(req.params.id)
      .then(tweet => {
        tweet.update({
          description: req.body.description
        })
          .then(tweet => {
            return callback({ status: 'success', message: 'Tweet was successfully to update' })
          })
      })
  },
}

module.exports = tweetServices