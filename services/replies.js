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
                'name'
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
        id: element.id,
        comment: element.comment,
        tweetId: element.TweetId,
        userId: element.UserId,
        name: element.User.name,
        tweetUser: element.Tweet.User.name,
        avatar: element.User.avatar,
        account: element.User.account,
        likeCount: element.ReplyLikes.likeNum,
        islike: element.isLike,
        createdAt: element.createdAt
      }))
      return replies
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = replies
