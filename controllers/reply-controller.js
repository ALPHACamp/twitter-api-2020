const { Reply, ReplyLike } = require('../models')
const helpers = require('../_helpers')
const replyService = require('../services/replies')

const replyController = {
  create: async (req, res, next) => {
    try {
      const user = helpers.getUser(req)
      const tweetId = req.params.tweet_id
      const comment = req.body.comment
      const blank = new Set(comment)
      if (!comment.length || blank.has(' ')) throw new Error('回覆內容不可空白')
      await Reply.create({
        comment,
        UserId: user.id,
        TweetId: tweetId
      })
      res.sendStatus(200)
    } catch (err) {
      next(err)
    }
  },
  getAll: async (req, res, next) => {
    try {
      const TweetId = Number(req.params.tweet_id)
      const UserId = helpers.getUser(req).id
      const replies = await replyService.getAll(TweetId, UserId)
      if (!replies) throw new Error('該推文沒有回覆')
      res.status(200).json(replies)
    } catch (err) {
      next(err)
    }
  },
  add: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id
      const ReplyId = Number(req.params.id)
      const TweetId = Number(req.params.tweetId)
      const replyLike = await ReplyLike.findOne({
        where: {
          UserId,
          ReplyId
        }
      })
      if (replyLike) throw new Error('已經喜歡過了')
      await ReplyLike.create({
        UserId,
        ReplyId
      })
      const replies = await replyService.getAll(TweetId, UserId)
      if (!replies.length) throw new Error('該推文沒有回覆')
      res.status(200).json(replies)
    } catch (err) {
      next(err)
    }
  },
  remove: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id
      const ReplyId = Number(req.params.id)
      const TweetId = Number(req.params.tweetId)
      const replyLike = await ReplyLike.findOne({
        where: {
          User_id: UserId,
          Reply_id: ReplyId
        }
      })
      if (!replyLike) throw new Error('已經不喜歡了')
      await ReplyLike.destroy({
        where: {
          UserId,
          ReplyId
        }
      })
      const replies = await replyService.getAll(TweetId, UserId)
      if (!replies.length) throw new Error('該推文沒有回覆')
      res.status(200).json(replies)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = replyController
