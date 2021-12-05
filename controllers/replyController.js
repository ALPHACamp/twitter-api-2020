const { Reply, User } = require('../models')
const { helpers } = require('../_helpers')

const replyController = {
  postReply: async (req, res) => {
    try {
      await Reply.create({
        UserId: helpers.getUser(req).id,
        TweetId: Number(req.params.tweet_id),
        comment: req.body.comment
      })
      await Reply.findAll({ raw: true, nest: true })
      res.status(200).json({ status: 'success', message: '成功回覆貼文' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ status: 'error', message: 'Server error' })
    }
  },
  getTweetReply: async (req, res) => {
    try {
      const tweetid = Number(req.params.tweet_id)
      const replies = await Reply.findAll({ raw: true, nest: true, where: { tweetid: tweetid }, include: [{ model: User }] })

      const results = replies.map(data => ({
        id: data.id,
        User: {
          id: data.User.id,
          name: data.User.name,
          account: data.User.account,
          avatar: data.User.avatar
        },
        comment: data.comment,
        createdAt: data.createdAt
      }))

      results.sort((a, z) => z.createdAt - a.createdAt)

      return res.status(200).json(results)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ status: 'error', message: 'Server error' })
    }
  }

}

module.exports = replyController
