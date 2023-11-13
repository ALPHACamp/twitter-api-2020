
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
//const updateLocale = require('dayjs/plugin/updateLocale')
require('dayjs/locale/zh-tw')
dayjs.locale('zh-tw')
dayjs.extend(relativeTime)
//dayjs.extend(updateLocale)
const helpers = require('../_helpers')
const { User, Tweet, Reply, Like, Followship, sequelize } = require('../models')
const { Op } = require("sequelize")


const tweetServices = {
  getTweets: (req, cb) => {
    const UserId = helpers.getUser(req).id
    return Promise.all([
      Like.findAll({ where: { userId: UserId } }),
      Reply.findAll({ where: { userId: UserId } }),
      Tweet.findAll({ raw: true, include: [User], order: [['createdAt', 'DESC']] })
    ])
      .then(([likes, replies, tweets]) => {
        for (let i = 0; i < tweets.length; i++) {
          const createdAtDate = dayjs(tweets[i].createdAt);
          const updatedAtDate = dayjs(tweets[i].updatedAt);
          tweets[i].createdAt = createdAtDate.fromNow()
          tweets[i].updatedAt = updatedAtDate.fromNow()
          tweets[i]["likeCount"] = likes.length
          tweets[i]["replyCount"] = replies.length
        }
        cb(null, tweets);
      })

      .catch(err => cb(err))
  },
  getTweet: (req, cb) => {
    return Promise.all([
      Like.findAll({ where: { tweetId: req.params.id } }),
      Reply.findAll({ where: { tweetId: req.params.id } }),
      Tweet.findByPk(req.params.id, { include: [User] })
    ])
      .then(([likes, replies, tweet]) => {
        if (!tweet) {
          throw new Error("Tweet didn't exist!");
        }
        tweet = tweet.toJSON();
        tweet.createdAt = dayjs(tweet.createdAt).fromNow();
        tweet.updatedAt = dayjs(tweet.updatedAt).fromNow();
        tweet["likeCount"] = likes.length
        tweet["replyCount"] = replies.length
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

        if (!tweet) throw new Error("tweet didn't exist!")
        if (like) throw new Error('You have favorited this tweet!')

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