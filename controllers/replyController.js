const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const helpers = require('../_helpers')

const replyController = {
  getReplies: (req, res) => {
    Promise.all([
      Tweet.findOne({
        where: { id: req.params.tweetId },
        include: [User]
      }),
      Reply.findAll({
        where: { TweetId: req.params.tweetId },
        include: User,
        order: [['createdAt', 'DESC']]
      })
    ]).then(([tweet, replies]) => {
      replies.push({ TweetOwner: tweet.User.account })
      return res.json(replies)
    })
  }, 
  postReply: (req, res) => {
    if (!req.body.comment) {
      return res.json({ status: 'error', message: 'No comment content' })
    }
    if (req.body.comment.length >= 280 ) {
      return res.json({ status: 'error', message: 'Comment exceeds limit' })
    }
    Reply.create({
      TweetId: req.params.tweetId,
      UserId: helpers.getUser(req).id, 
      comment: req.body.comment
    }).then(() => {
      return res.json({ status: 'success', message: ''})
    })
  }
}


module.exports = replyController