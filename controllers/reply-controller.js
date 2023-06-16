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
    // include: [{
    //     model: User,
    //     attributes: {
    //     exclude: [ 'password', 'role'],
        
    //     }
    //   }, {
    //     model: Tweet,
    //     include: [
    //         {
    //           model: User,
    //           attributes: ['id', 'account', 'name', 'avatar']
    //         }
    //       ]
    //   }
    // ],
    raw: true
  })
  .then((replies) => {
    if (!replies) throw new Error("Replies didn't exists!")
  //   const nestedReplies = replies.map((reply) => ({
  //   // reply
  //   replyId: reply.id,
  //   comment: reply.comment,
  //   createdAt: reply.createdAt,
  //   updatedAt: reply.updatedAt,
  //   // reply's userId
  //   replierUserData: {
  //     replierUserId: reply['User.id'],
  //     account: reply['User.account'],
  //     name: reply['User.name'],
  //     avatar: reply['User.avatar'],
  //     createdAt: reply.createdAt,
  //     updatedAt: reply.updatedAt,
  //   },
  //   tweetData: {
  //     tweetId: reply.TweetId,
  //     tweetText: reply['Tweet.description'],
  //     tweetPosterId: reply['Tweet.User.id'],
  //     tweetPosterAccount: reply['Tweet.User.account'],
  //     createdAt: reply['Tweet.createdAt'],
  //     updatedAt: reply['Tweet.updatedAt']
  //   }
  // }))

    res.status(200).json(replies)
  })
  .catch((err) => next(err))
  }
}  

module.exports = replyController