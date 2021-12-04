const { json } = require('body-parser')
const db = require('../../models')
const { Tweet, User, Reply, Like, sequelize } = db
const helpers = require('../../_helpers')

const tweetController = {
  getReplies: async (req, res) => {
    try {
      const replies = await Reply.findAll({
        where: { TweetId: req.params.id },
        include: [User, { model: Tweet, include: User }]
      })
      return res.json(replies)
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = tweetController
