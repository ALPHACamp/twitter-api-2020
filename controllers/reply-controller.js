const { Tweet, User, Reply } = require('../models')
const Sequelize = require('sequelize')
const { literal } = Sequelize
const moment = require('moment')

const replyController = {
  postComment: (req, res, next) => {
    const tweetId = req.params.tweet_id
    return Tweet.findByPk(tweetId, {
      include: [Reply]
    }).then(tweet => {
      const { comment } = req.body
      const userId = req.user.id
      if (!comment) throw new Error('Comment text is required!')
      if (!tweet) throw new Error("Tweet didn't exist!")
      return Reply.create({
        userId,
        tweetId,
        comment
      })
    }).then(reply => res.status(200).json(reply))
      .catch(err => next(err))
  },
  getComment: (req, res, next) => {
    const tweetId = req.params.tweet_id
    return Reply.findAll({
    where: { tweetId },
    order: [['createdAt', 'DESC']],
    attributes: {
      exclude: ['UserId', 'TweetId'],
    },
    raw: true
  })
  .then((replies) => {
    if (!replies) throw new Error("Replies didn't exists!")
    res.status(200).json(replies)
  })
  .then(reply => {
    if (!reply.length) throw new Error("Replies didn't exist!")
    res.status(200).json(reply)
  })
  .catch(err => next(err))
  }
}  

module.exports = replyController