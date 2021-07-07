const db = require('../models')
const Tweet = db.Tweet
const Reply = db.Reply

const tweetController = {
  postTweet: (req, res) => {
    const { description } = req.body
    if (!description) {
      return res.status(400).json({
        status: 'error',
        message: 'Description can not be null'
      })
    } else if (description.length > 140) {
      return res.status(400).json({
        status: 'error',
        message: 'Description can not be longer than 140'
      })
    } else {
      return Tweet.create({
        UserId: req.user.id,
        description,
        replyCount: 0,
        likeCount: 0
      }).then(tweet => {
        return res.status(200).json({
          id: tweet.id,
          status: 'success',
          message: 'Create tweet successfully'
        })
      })
    }
  },

  postReply: (req, res) => {
    const { comment } = req.body
    const TweetId = req.params.id
    const UserId = req.user.id

    if (!comment) {
      return res.status(400).json({
        status: 'error',
        message: 'Comment can not be null'
      })
    }

    return Tweet.findByPk(TweetId)
      .then(tweet => {
        if (!tweet) {
          return res.status(400).json({
            status: 'error',
            message: 'Tweet does not exist'
          })
        }

        return Reply.create({
          UserId,
          TweetId,
          comment
        }).then(reply => {
          return res.status(200).json({
            id: reply.id,
            status: 'success',
            message: 'Reply has been created successfully'
          })
        })
      })
  }
}



module.exports = tweetController