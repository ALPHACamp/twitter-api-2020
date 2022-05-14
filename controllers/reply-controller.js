const { Reply, User } = require('../models')
const helpers = require('../_helpers')
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
          { model: User }
        ],
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
        account: element.User.account
      }))
      res.status(200).json(replies)
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = replyController
