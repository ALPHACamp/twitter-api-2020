const { Reply } = require('../models')
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
      const reply = await Reply.findAll({
        where: {
          TweetId
        },
        raw: true
      })
      res.status(200).json(reply)
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = replyController
