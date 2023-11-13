const tweetServices = require('../../services/tweet-services')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);
const helpers = require('../../_helpers')
const { User, Tweet, Reply, Like, Followship, sequelize } = require('../../models')
const { Op } = require("sequelize");

const tweetController = {
  getTweets: (req, res, next) => {
    tweetServices.getTweets(req, (err, data) => err ? next(err) : res.json(data))
  },
  getTweet: (req, res, next) => {
    tweetServices.getTweet(req, (err, data) => err ? next(err) : res.json(data))
  },
  postTweet: (req, res, next) => {
    tweetServices.postTweet(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getTweetReplies: (req, res, next) => {

    const tweetId = req.params.tweetId

    Promise.all([
      User.findAll({
      }),
      Reply.findAll({
        where: { TweetId: tweetId },
        order: [['createdAt', 'DESC']],
      })
    ]).then(([users, comments]) => {

      for (let i = 0; i < comments.length; i++) {

        for (let j = 0; j < users.length; j++) {
          if (comments[i].dataValues.UserId == users[j].dataValues.id) {
            comments[i].dataValues.User = users[j].dataValues
          }
        }
      }
      for (let i = 0; i < comments.length; i++) {
        const createdAtDate = dayjs(comments[i].createdAt);
        const updatedAtDate = dayjs(comments[i].updatedAt);
        comments[i].dataValues.createdAt = createdAtDate.fromNow()
        comments[i].dataValues.updatedAt = updatedAtDate.fromNow()
      }
      res.json(
        comments
      )
    })
  },
  postTweetReply: (req, res, next) => {
    const TweetId = req.params.tweetId
    const UserId = helpers.getUser(req).id
    const comment = req.body.comment
    if (!comment) throw new Error('comment is empty')

    return Tweet.findByPk(TweetId)
      .then(tweet => {
        if (!tweet) throw new Error('tweet not found')
        return Reply.create({
          comment,
          UserId,
          TweetId
        })
          .then(reply => {
            return res.json({
              reply
            })
          })
      })
      .catch(err => next(err))

  },
  addLike: (req, res, next) => {
    tweetServices.addLike(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  removeLike: (req, res, next) => {
    tweetServices.removeLike(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
}
module.exports = tweetController