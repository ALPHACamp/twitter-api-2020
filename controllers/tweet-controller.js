const sequelize = require('sequelize')
const { Tweet, User, Reply, Like } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      include: [
        { model: User, attributes: { exclude: ['password'] } }
      ]
    })
      .then(tweets => {
        res.json(tweets)
      })
      .catch(err => next(err))
  },
  getTweet: (req, res, next) => {
    const tweetId = req.params.tweetId
    return Tweet.findByPk(tweetId, {
      include: [
        { model: User, attributes: { exclude: ['password'] } }
      ]
    })
      .then(tweet => {
        res.json( tweet )
      })
      .catch(err => next(err))
  },
  getReplies: (req, res, next) => {
    const tweetId = req.params.tweetId
    return Reply.findAll({
      where: {tweetId},
      include: [
        { model: User, attributes: { exclude: ['password'] } },
        { model: Tweet, include: [{ model: User, attributes: { exclude: ['password'] } }] },
      ]
    })
      .then(replies => {
        res.json(replies)
      })
      .catch(err => next(err))
  },
  postTweet: (req, res, next) => {
    const { description } = req.body
    const getUser = helpers.getUser(req)
    const userId = getUser.id
    if (!description) throw new Error('Description text is required!')
    return User.findByPk(userId)
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        return Tweet.create({
          description,
          userId
        })
      })
      .then(tweets => {
        res.json({
          status: 'success',
          data: tweets
        })
      })
      .catch(err => next(err))
  },
  deleteTweet: (req, res, next) => {
    const tweetId = req.params.tweetId
    return Tweet.findByPk(tweetId)
      .then(tweet => {
        if (!tweet) throw new Error("Tweet didn't exist!")
        return tweet.destroy()
      })
      .then(() => {
        res.json({
          status: 'success',
          message: 'Tweet deleted successfully'
        })
      })
      .catch(err => next(err))
  },
  postReplies: (req, res, next) => {
    const { comment } = req.body
    const tweetId = req.params.tweetId
    const getUser = helpers.getUser(req)
    const userId = getUser.id
    return Tweet.findByPk(tweetId)
      .then(tweet => {
        if (!tweet) throw new Error("Tweet didn't exist!")
        return Reply.create({
          comment,
          userId,
          tweetId,
        })
      })
      .then(reply => {
        res.json({
          status: 'success',
          data: reply
        })
      })
      .catch(err => next(err))
  },
  postLike: (req, res, next) => {
    const tweetId = req.params.tweetId
    const getUser = helpers.getUser(req)
    const userId = getUser.id
    return Promise.all([
      Tweet.findByPk(tweetId),
      Like.findOne({
        where: {
          userId,
          tweetId
        }
      })
    ])
      .then(([tweet, like]) => {
        if (!tweet) throw new Error("Tweet didn't exist!")
        if (like) throw new Error("You have liked this tweet!")
        return Like.create({
          userId,
          tweetId,
        })
      })
      .then(like => {
        res.json({
          status: 'success',
          data: like
        })
      })
      .catch(err => next(err))
  },
  postUnlike: (req, res, next) => {
    const tweetId = req.params.tweetId
    const getUser = helpers.getUser(req)
    const userId = getUser.id
    return Promise.all([
      Tweet.findByPk(tweetId),
      Like.findOne({
        where: {
          userId,
          tweetId
        }
      })
    ])
      .then(([tweet, like]) => {
        if (!tweet) throw new Error("Tweet didn't exist!")
        if (!like) throw new Error("You haven't liked this tweet!")
        return Like.destroy({
          where: {
            userId,
            tweetId
          }
        })
      })
      .then(unlike => {
        console.log(unlike)
        res.json({
          status: 'success',
          data: unlike
        })
      })
      .catch(err => next(err))
  }
}

module.exports = tweetController
