const { ReplyLike, Reply, Tweet, User } = require('../models')
const sequelize = require('sequelize')

const replies = {
  getAll: async (TweetId, UserId) => {
    try {
      const rawReply = await Reply.findAll({
        where: {
          TweetId
        },
        include: [
          {
            model: Tweet,
            include: {
              model: User,
              attributes: [
                'account'
              ]
            }
          },
          { model: User },
          {
            model: ReplyLike,
            attributes: [
              [sequelize.fn('COUNT', sequelize.col('ReplyLikes.Reply_id')), 'likeNum']
            ]
          }
        ],
        order: [['created_at', 'DESC']],
        group: ['id'],
        nest: true,
        raw: true
      })
      if (UserId) {
        const userLikesReply = await ReplyLike.findAll({
          attributes: [
            'Reply_id'
          ],
          where: {
            User_id: UserId
          },
          raw: true
        })
        if (!userLikesReply) {
          rawReply.forEach(element => {
            element.isLike = false
          })
        } else {
          userLikesReply.forEach(likeReplies => {
            rawReply.forEach(reply => {
              if (likeReplies.Reply_id === reply.id) {
                reply.isLike = true
              } else if (!reply.isLike) { reply.isLike = false }
            })
          })
        }
      }

      const replies = rawReply.map(element => ({
        avatar: element.User.avatar,
        userName: element.User.name,
        userAccount: element.User.account,
        replyCreatedAt: element.createdAt,
        replyAccount: element.Tweet.User.account,
        comment: element.comment,
        totalLikeCount: element.ReplyLikes.likeNum,
        totalReplyCount: Math.floor(Math.random() * 100),
        UserId: element.UserId,
        replyId: element.id,
        islike: element.isLike,
        tweetId: element.TweetId
      }))
      return replies
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = replies
