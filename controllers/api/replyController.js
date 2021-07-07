const db = require('../../models')
const Reply = db.Reply
const User = db.User
const Tweet = db.Tweet
const defaultLimit = 10
//temp 
let currentUserId = 1

let replyController = {
  getReplies: (req, res) => {
    const options = {
      limit: +req.query.limit || defaultLimit,
      offset: +req.query.offset || 0,
      where: {
        TweetId: req.params.tweetId,
      },
      attributes: ['id', 'comment', 'createdAt'],
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, attributes: ['id', 'account', 'name', 'avatar'] },
      ],
    }
    Reply.findAll(options)
      .then((replies) => res.status(200).json(replies))
      .catch(() => res.status(404).json({ status: 'error', message: '' }))
  },
  postReply: (req, res) => {
    if (!req.body.comment) {
      return res
        .status(400)
        .json({ status: 'error', messgae: 'Can not post empty comment' })
    }
    if (req.body.comment.length > 140) {
      return res.status(400).json({
        status: 'error',
        message: 'Can not post over 140 characters',
      })
    }
    const data = {
      UserId: currentUserId,
      TweetId: req.params.tweetId,
      comment: req.body.comment,
    }
    Reply.create(data)
      .then((reply) => {
        Tweet.findByPk(req.params.tweetId)
          .then((tweet) => tweet.increment({ replyNum: 1 }))
          .then(() =>
            res.status(200).json({
              status: '200',
              message: 'Successfully posted new reply.',
            })
          )
      })
      .catch((error) =>
        res.status(400).json({
          status: 'error',
          message: '',
        })
      )
  },
  getRepliedTweets: (req, res) => {
    const options = {
      attributes: ['id', 'UserId', 'TweetId', 'comment', 'createdAt'],
      where: { UserId: req.params.id },
      include: {
        model: Tweet,
        as: 'repliedTweet'
      },
      order: [['createdAt', 'desc']]
    }
    Reply.findAll(options)
      .then(replies => {
        return res.status(200).json(replies)
      }).catch(error => res.status(500).json({ status: 'error', message: error }))
  }
}

module.exports = replyController
