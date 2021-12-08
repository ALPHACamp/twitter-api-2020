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
          message: 'This tweet did Not exist!'
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
        }
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
          message: 'This tweet did Not exist!'
        })
      }

      if (!comment.trim()) {
        return res.json({
          status: 'error',
          message: 'Comment can NOT be empty!'
        })
      }

      await Reply.create({
        UserId: helpers.getUser(req).id,
        TweetId: req.params.id,
        comment
      })
      return res.json({
        status: 'success',
        message: 'Comment was successfully posted!'
      })
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = tweetController
