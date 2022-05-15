const { Reply, User, ReplyLike } = require('../models')
const helpers = require('../_helpers')
const sequelize = require('sequelize')

const replyController = {
  create: async (req, res) => {
    try {
      const user = helpers.getUser(req)
      const tweetId = req.params.tweet_id
      await Reply.create({
        comment: req.body.comment,
        UserId: user.id,
        TweetId: tweetId
      })
      res.sendStatus(200)
    } catch (err) {
      console.log(err)
    }
  },
  getAll: async (req, res) => {
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
        group: ['id'],
        nest: true,
        raw: true
      })
      const replies = rawReply.map(element => ({
        id: element.id,
        comment: element.comment,
        tweetId: element.TweetId,
        userId: element.UserId,
        name: element.User.name,
        avatar: element.User.avatar,
        account: element.User.account,
        likeCount: element.ReplyLikes.likeCounts
      }))
      res.status(200).json(replies)
    } catch (err) {
      console.log(err)
    }
  },
  add: async (req, res) => {
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
      res.sendStatus(200)
    } catch (err) {
      console.log(err)
    }
  },
  remove: async (req, res) => {
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
      res.sendStatus(200)
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = replyController
