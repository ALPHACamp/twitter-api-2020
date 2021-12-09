const db = require('../../models')
const { Tweet, User, Reply, Like, sequelize } = db
const helpers = require('../../_helpers')

const tweetController = {
  getReplies: async (req, res) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id)
      if (!tweet) {
        return res.json({
          status: 'error',
          message: '此則貼文不存在!'
        })
      }

      const replies = await Reply.findAll({
        raw: true,
        nest: true,
        where: { TweetId: req.params.id },
        attributes: [
          ['id', 'ReplyId'],
          'UserId',
          'TweetId',
          'comment',
          'createdAt',
          'updatedAt'
        ],
        include: {
          model: User,
          attributes: ['avatar', 'account', 'name']
        },
        order: [['createdAt', 'DESC']]
      })
      return res.json(replies)
    } catch (err) {
      console.log(err)
    }
  },
  postReply: async (req, res) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id)
      const { comment } = req.body

      if (!tweet) {
        return res.json({
          status: 'error',
          message: '要回覆的貼文不存在!'
        })
      }

      if (!comment.trim()) {
        return res.json({
          status: 'error',
          message: '內容不可空白'
        })
      }

      await Reply.create({
        UserId: helpers.getUser(req).id,
        TweetId: req.params.id,
        comment
      })
      return res.json({
        status: 'success',
        message: '成功回覆推文!'
      })
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = tweetController
