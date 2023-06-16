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
    include: [
      {
        model: Tweet,
        attributes: [
        [
          Sequelize.literal('Tweet.id'), 'TweetId'
        ],
        [
          Sequelize.literal('Tweet.description'), 'TweetDescription'
        ]
      ]
      }
    ],
    raw: true
  })
  .then((replies) => {
        if (!replies) throw new Error('Replies are not exists!')
        const modifyReply = replies.map((reply) => {
          const createdAt = moment(reply.createdAt).format('YYYY-MM-DD HH:mm:ss')
          const updatedAt = moment(reply.updatedAt).format('YYYY-MM-DD HH:mm:ss')
          return {
            ...reply,
            createdAt,
            updatedAt
          }
        })
        
        return res.status(200).json(modifyReply)
        })
  .catch((err) => next(err))
  }
}  

module.exports = replyController