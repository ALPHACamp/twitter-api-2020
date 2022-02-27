const { Reply, Tweet, User } = require('../models')
const replyController = {
  getUserReplies: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id)
      const reply = await Reply.findByPk(req.params.id)
      if (!user) {
        return res
          .status(404)
          .json({
            status: 'error',
            message: '使用者不存在'
          })
      }
      if (!reply) {
        return res
          .status(400)
          .json({
            status: 'error',
            message: '使用者沒有回覆過的推文'
          })
      }
      const replies = await Reply.findAll({
        where: {
          UserId: req.params.id
        },
        order: [['createdAt', 'desc']],
        attributes: ['comment'],
        include: [
          {
            model: Tweet,
            attributes: ['UserId'],
            include: [
              { model:User,
                attributes:['account']
              }
            ]
          },
          { model: User,
            attributes:['name','account'] }
        ]
      })
      if (replies.length == 0) {
        return res
          .status(404)
          .json({
            status: 'error',
            message: '回覆不存在'
          })
      }
      return res.status(200).json(replies)
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error
      })
    }
  },
  getTweetReplies: async (req, res) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id)
      if (!tweet) {
        return res.status(404).json({
          status: 'error',
          message: '這篇推文不存在',
        })
      }
      const replies =  await Reply.findAll({
        where: {
          TweetId: req.params.id
        },
        order: [['createdAt', 'desc']],
      })
      if (!replies) {
        return res.status(404).json({
        status: 'error',
        message: '這篇推文沒有回覆',
        })
      } else {
        return res.status(200).json({
          status: 'success',
          message: '成功找到回覆',
          Reply: replies
        })
      }
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error
      })
    }
},
  postTweetReplies: (req, res) => {
    const { TweetId, comment } = req.body
    const UserId = req.user.id
    if (!comment) {
      return res
        .status(400)
        .json({
          status: 'error',
          message: '內容不可為空白'
        })
    }
    if (comment.length > 140) {
      return res
        .status(400)
        .json({
          status: 'error',
          message: '不可超過140字'
        })
    }
    return Promise.all([
      User.findByPk(UserId),
      Tweet.findByPk(TweetId)
    ])
      .then(([user, tweet]) => {
        if (!user) {
          return res
            .status(404)
            .json({
              status: 'error',
              message: '使用者不存在'
            })
        }
        if (!tweet) {
          return res
            .status(404)
            .json({
              status: 'error',
              message: '推文不存在'
            })
        }
        return Reply.create({
          comment,
          TweetId,
          UserId
        })
      })
      .then(reply => {
        return res.status(200).json({
          status: 'success',
          message: '成功新增回覆',
          Reply: reply
        })})
      .catch((error) => res.status(500).json({
        status: 'error',
        message: error
      }))
  }
}
module.exports = replyController