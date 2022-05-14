const { Tweet } = require('../models')
const tweetServices = require('../services/tweets')
const helpers = require('../_helpers')

const tweetController = {
  getAll: async (req, res) => {
    try {
      const tweets = await tweetServices.getAll()
      res.status(200).json(tweets)
    } catch (err) {
      console.log(err)
    }
  },
  create: async (req, res) => {
    try {
      const user = helpers.getUser(req)
      const tweet = req.body.description
      if (tweet.length > 140) throw new Error('字數超過 140')
      await Tweet.create({
        UserId: user.id,
        description: tweet
      })
      res.sendStatus(200)
    } catch (err) {
      console.log(err)
    }
  },
  getOne: async (req, res) => {
    try {
      const tweetId = req.params.id
      const tweet = await tweetServices.getOne(tweetId)
      res.status(200).json(tweet)
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = tweetController
