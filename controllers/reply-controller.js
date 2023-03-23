const { User, Tweet, Reply } = require('../models')
const helpers = require('../_helpers')

const replyController = {
  // feature: user can see all replies of the specific tweet
  // route: GET /api/tweets/:tweet_id/replies
  getReplies: async (req, res, next) => {
    try {
      const tweet = await Tweet.findByPk(req.params.tweet_id)
      if (!tweet) throw new Error('Target tweet not exist')
      const replies = await Reply.findAll({
        where: { TweetId: req.params.tweet_id },
        include: [{ model: User }, { model: Tweet, include: User }],
      })
      const replySort = replies
        .map((reply) => {
          const { User, Tweet, ...restProps } = {
            ...reply.toJSON(),
            replyUser: {
              id: reply.User.id,
              name: reply.User.name,
              account: reply.User.account,
              avatar: reply.User.avatar
            },
            tweetUser: {
              id: reply.Tweet.User.id,
              name: reply.Tweet.User.name,
              account: reply.Tweet.User.account,
            },
          }
          return restProps
        })
        .sort((a, b) => b.createAt - a.createAt)
      res.json(replySort)
    } catch (err) {
      next(err)
    }
  },
  // feature: user can post a reply to the specific tweet
  // route: POST /api/tweets/:tweet_id/replies
  postReply: async (req, res, next) => {
    try {
      const currentUser = helpers.getUser(req)
      const { comment } = req.body
      if (!comment || (comment.trim() === '')) throw new Error('comment field is required.')
      if (comment.length > 140) throw new Error('Characters length of comment should be less than 140.')
      const tweet = await Tweet.findByPk(req.params.tweet_id)
      if (!tweet) throw new Error('Target tweet not exist')
      await Reply.create({
        UserId: currentUser.id,
        TweetId: req.params.tweet_id,
        comment,
      })
      res.json({ status: 'success' })
    } catch (err) {
      next(err)
    }
  },
}

module.exports = replyController
