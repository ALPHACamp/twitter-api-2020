const db = require('../../models')
const Reply = db.Reply
const User = db.User
const Tweet = db.Tweet
const defaultLimit = 10


let replyController = {
  getReplies: (req, res) => {
    const options = {
      limit: +req.query.limit || defaultLimit,
      offset: +req.query.offset || 0,
      where: {
        TweetId: +req.params.tweetId,
      },
      attributes: ['id', 'comment', 'createdAt'],
      order: [['createdAt', 'ASC']],
      include: [{
        model: User,
        attributes: ['id', 'account', 'name', 'avatar']
      },
      ],
    }
    Reply.findAll(options)
      .then((replies) => res.status(200).json(replies))
      .catch((error) => res.status(500).json({
        status: 'error',
        message: error
      }))
  },
  postReply: (req, res) => {
    if (!req.body.comment) {
      return res
        .status(400)
        .json({
          status: 'error',
          message: 'Cannot post empty comment.'
        })
    }
    if (req.body.comment.length > 140) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot post over 140 characters.',
      })
    }
    const data = {
      UserId: +req.user.id,
      TweetId: +req.params.tweetId,
      comment: req.body.comment,
    }
    Reply.create(data)
      .then((reply) => {
        Tweet.findByPk(+req.params.tweetId)
          .then((tweet) => tweet.increment({ replyNum: 1 }))
          .then(() =>
            res.status(200).json({
              status: '200',
              message: 'Successfully posted new reply.',
            })
          )
      })
      .catch((error) =>
        res.status(500).json({
          status: 'error',
          message: error,
        })
      )
  },
  getRepliedTweets: (req, res) => {
    const options = {
      limit: +req.query.limit || defaultLimit,
      offset: +req.query.offset || 0,
      attributes: ['id', 'UserId', 'TweetId', 'comment', 'createdAt'],
      where: { UserId: +req.params.id },
      include: {
        model: Tweet,
        as: 'RepliedTweet',
        attributes: [
          'id',
          'description',
          'likeNum',
          'replyNum',
          'createdAt'
        ],
        include: [
          {
            model: User,
            as: 'Author',
            attributes: ['id', 'name', 'account', 'avatar']
          },
          {
            model: User,
            as: 'LikedUsers',
            attributes: ['id'],
            through: {
              attributes: []
            }
          }
        ]
      },
      order: [['createdAt', 'desc']]
    }
    Reply.findAll(options)
      .then(replies => {
        replies = replies.map(reply => {
          reply.comment = reply.comment.substring(0, 50)
          reply.RepliedTweet.description = reply.RepliedTweet.description.substring(0, 50)
          reply.RepliedTweet.dataValues.isLike = reply.RepliedTweet.dataValues.LikedUsers.some(
            (likedUser) => likedUser.id === +req.user.id
          )
          delete reply.RepliedTweet.dataValues.LikedUsers
          return reply
        })
        return res.status(200).json(replies)
      }).catch(error => res.status(500).json({
        status: 'error',
        message: error
      }))
  }
}

module.exports = replyController
