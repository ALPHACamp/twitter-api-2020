const { Tweet, sequelize } = require('../models')
const { User } = require('../models')
const { Like } = require('../models')
const { Reply } = require('../models')
const {getUer} = require('../_helpers')

const tweetController = {
  getTweets: async (req, res) => {
    try {
      const tweets = await Tweet.findAll({
        include: [{ model: User }, { model: Like }, { model: Reply }]
      })


      let results = tweets.map((tweet) => ({
        id: tweet.dataValues.id,
        description: tweet.dataValues.description,
        createdAt: tweet.dataValues.createdAt,
        User: tweet.dataValues.User.toJSON(),
        likeCounts: tweet.dataValues.Likes.length,
        replyCounts: tweet.dataValues.Replies.length
      }))

      results = results.sort((a,z)=> z.createdAt - a.createdAt)

      console.log(results)

      return res.status(200).json(results)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ status: 'error', message: 'Server error' })
    }
  }
}

module.exports = tweetController
