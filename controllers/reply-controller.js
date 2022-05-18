const { Reply, User, ReplyLike } = require('../models')
const helpers = require('../_helpers')
const replyLikeService = require('../services/replyLikes')
const sequelize = require('sequelize')

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
      const TweetId = req.params.tweet_id
      const rawReply = await Reply.findAll({
        where: {
          TweetId
        },
        include: [
          { model: User },
          {
            model: ReplyLike,
            attributes: [
              [sequelize.fn('COUNT', sequelize.col('ReplyLikes.Reply_id')), 'likeCounts']
            ]
          }
        ],
        order: [['created_at', 'DESC']],
        group: ['id'],
        nest: true,
        raw: true
      })

      if (!rawReply) throw new Error('該推文沒有回覆')
      const replies = rawReply.map(element => ({
        id: element.id,
        comment: element.comment,
        tweetId: element.TweetId,
        userId: element.UserId,
        name: element.User.name,
        avatar: element.User.avatar,
        account: element.User.account,
        likeCount: element.ReplyLikes.likeCounts,
        createdAt: element.createdAt
      }))
      res.status(200).json(replies)
    } catch (err) {
      next(err)
    }
  },
  add: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id
      const ReplyId = Number(req.params.id)
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
      const replyLikesNum = await replyLikeService.count(ReplyId)
      const data = {
        replyLikeNum: Number(replyLikesNum[0])
      }
      res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },
  remove: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id
      const ReplyId = Number(req.params.id)
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
      const replyLikesNum = await replyLikeService.count(ReplyId)
      const data = {
        replyLikeNum: Number(replyLikesNum[0])
      }
      res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = replyController
