const db = require('../models')
const helpers = require('../_helpers')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like

const tweetServices = {
  getTweets: (req, res, callback) => {
    Tweet.findAll({
      // raw: true, nest: true,
      include: [
        User,
        { model: Reply, include: [User] },
        { model: Like, include: [User] }
      ]
    })
      .then(tweets => {
        return callback(tweets)
      })
  },
  getTweet: (req, res, callback) => {
    Tweet.findByPk(req.params.tweet_id, {
      include: [
        User,
        { model: Like, include: [User] },
        { model: Reply, include: [User] }
      ]
    })
      .then(tweet => {
        return callback([tweet])
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