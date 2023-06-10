const { relativeTimeFromNow } = require('../helpers/dayjs-helpers')
const helpers = require('../_helpers')
const {
    Reply, User, Tweet
} = require('../models')

const replyController = {
  getReplies: async(req, res, next) => {
    try {
      const { id } = req.params
      const replies = await Reply.findAll({
        raw: true,
          nest: true,
          where: {
              TweetId: id
          },
          order: [['createdAt', 'DESC']],
          include: [
              {
                  model: User
              },
          ],
      })
      const newComment = replies.map(comment => {
        comment.createdAt = relativeTimeFromNow(comment.createdAt)
        delete comment.User.password  
        return comment
      })
      res.status(200).json(newComment)
    } catch (err) {
        next(err)
    }
  },
  postReplies: async(req, res, next) => {
        try{
          const { id } = req.params
          const { comment } = req.body
          if (!comment) throw new Error('回覆不能為空！')
          const user = await User.findByPk(helpers.getUser(req).id)
          const tweet = Tweet.findByPk(id)
          if (!user) throw new Error('查無此人！')
          if (!tweet) throw new Error('查無此篇貼文')
          await Reply.create({
            comment,
            TweetId: id,
            UserId: helpers.getUser(req).id
          })
          res.status(200).json(comment)
          } catch (err) {
            next(err)
        }
    },
  }
module.exports = replyController