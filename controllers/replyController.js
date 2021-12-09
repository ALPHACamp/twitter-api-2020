const { User, Tweet, Like, Reply } = require('../models')
const helpers = require('../_helpers')

let replyController = {
  postReply: async (req, res, next) => {
    try {
      const tweet = await Tweet.findByPk(req.params.tweetId)
      if (!tweet) throw new Error("this tweet doesn't exist")
      if (!req.body.comment) throw new Error('請輸入必填項目')
      const reply = await Reply.create({
        comment: req.body.comment,
        UserId: helpers.getUser(req).id,
        TweetId: req.params.tweetId
      })
      return res.json(reply)
    } catch (error) {
      next(error)
    }
  },

  getReply: async (req, res, next) => {
    try {
      let reply = await Reply.findAll({
        where: { TweetId: req.params.tweetId },
        include: { model: User, attributes: ['name', 'avatar', 'account'] }
      })
      if (!reply) throw new Error("this reply doesn't exist")

      replies = reply.map(r => ({
        ...r.dataValues
      }))

      return res.json(replies)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = replyController
