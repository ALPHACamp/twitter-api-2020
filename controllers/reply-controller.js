const { User, Tweet, Reply } = require('../models')
const helpers = require('../_helpers')

const replyController = {
  getReplies: async (req, res, next) => {
    try {
      const tweet = await Tweet.findByPk(req.params.tweet_id)
      if(!tweet) throw new Error('the tweet not exist')
      const replies = await Reply.findAll({
        where: { tweetId: req.params.tweet_id },
        include: [
          { model: User },
          { model: Tweet, include: User }
        ]
      })
      if (!replies) throw new Error('no reply for the tweet')
      const replySort = replies
        .map(reply => {
          const { User, Tweet, ...restProps } = {
            ...reply.toJSON(),
            replyUser: {
              id: reply.User.id,
              name: reply.User.name,
              account: reply.User.account
            },
            tweetUser: {
              id: reply.Tweet.User.id,
              name: reply.Tweet.User.name,
              account: reply.Tweet.User.account
            }
          }
          return restProps
        })
        .sort((a, b) => b.createAt - a.createAt)
        res.json(replySort)
    } catch (err) {
      next(err)
    }
  },
  postReply: async (req, res, next) => {
    try {
      const currentUser = helpers.getUser(req)
      const { comment } = req.body
      if (!comment || comment.trim() === '') throw new Error('comment could not be blank')
      if (comment.length > 140) throw new Error('comment length should be less than 140')
      const tweet = await Tweet.findByPk(req.params.tweet_id)
      if(!tweet) throw new Error('the tweet not exist')
      const reply = await Reply.create({
        UserId: currentUser.id,
        TweetId: req.params.tweet_id,
        comment
      })
      delete currentUser.password
      res.json({
        ...reply.toJSON(),
        currentUser
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = replyController