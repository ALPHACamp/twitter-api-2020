// const { Tweet } = require('../models')
// const dayjs = require('dayjs')
// const relativeTime = require('dayjs/plugin/relativeTime');
// dayjs.extend(relativeTime);
// const helpers = require('../_helpers')
//const tweetServices = require('../../services/tweet-services')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);
const helpers = require('../_helpers')
const { User, Tweet, Reply, Like, Followship, sequelize } = require('../models')
const { Op } = require("sequelize");

const tweetServices = {
  getTweets: (req, cb) => {
    Tweet.findAll({
      raw: true,
      nest: true,
    })
      .then(tweets => {
        for (let i = 0; i < tweets.length; i++) {
          const createdAtDate = dayjs(tweets[i].createdAt);
          const updatedAtDate = dayjs(tweets[i].updatedAt);
          tweets[i].createdAt = createdAtDate.fromNow()
          tweets[i].updatedAt = updatedAtDate.fromNow()
        }
        cb(null, tweets);
      })
      .catch(err => cb(err))
  },
  getTweet: (req, cb) => {
    return Tweet.findByPk(req.params.id)
      .then(tweet => {
        if (!tweet) {
          throw new Error("Tweet didn't exist!");
        }
        tweet = tweet.toJSON();
        tweet.createdAt = dayjs(tweet.createdAt).fromNow();
        tweet.updatedAt = dayjs(tweet.updatedAt).fromNow();
        return cb(null, tweet);
      })
      .catch(err => cb(err))
  },
  postTweet: (req, cb) => {
    const UserId = helpers.getUser(req).id
    const { description } = req.body
    if (!UserId) res.status(500).json({
      status: 'error',
      data: {
        'Error Message': 'userId is required'
      }
    })
    const { file } = req
    Tweet.create({ UserId, description })
      .then(newTweet => {

        cb(null, { tweet: newTweet })
      })
      .catch(err => cb(err))
  },
  addLike: (req, cb) => {
    const tweetId = req.params.id
    const UserId = helpers.getUser(req).id
    //console.log("------", helpers.getUser(req).id)
    //console.log("======", req.params)
    Promise.all([
      Tweet.findByPk(tweetId),
      Like.findOne({
        where: {
          UserId: UserId,
          TweetId: tweetId
        }
      })
    ])
      .then(([tweet, like]) => {
        //console.log("======")
        //console.log("======", tweet, "====", like)
        if (!tweet) throw new Error("tweet didn't exist!")
        if (like) throw new Error('You have favorited this tweet!')
        //console.log("======", tweet.id)
        return Like.create({
          UserId: UserId,
          TweetId: tweet.id
        })
      })
      .then(addLike => cb(null, addLike))
      .catch(err => cb(err))
  },
  removeLike: (req, cb) => {
    const tweetId = req.params.id
    const UserId = helpers.getUser(req).id
    //console.log("------", helpers.getUser(req).id)
    //console.log("======", req.params)
    return Like.findOne({
      where: {
        UserId: UserId,
        TweetId: tweetId
      }
    })
      .then(like => {
        if (!like) throw new Error("You haven't favorited this tweet")

        return like.destroy()
      })
      .then(removeLike => cb(null, removeLike))
      .catch(err => cb(err))
  }
}
module.exports = tweetServices