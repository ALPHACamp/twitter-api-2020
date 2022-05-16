const { Tweet } = require('../models')
const tweetServices = require('../services/tweets')
const helpers = require('../_helpers')
const { Op } = require('sequelize')

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
      const user = helpers.getUser(req).toJSON()
      const description = req.body.description
      if (description.length > 140) throw new Error('字數超過 140')
      await Tweet.create({
        UserId: user.id,
        description
      })
      const newTweet = await Tweet.findOne({
        where: {
          [Op.and]: [{ User_id: user.id }, { description }]
        },
        attributes: ['id'],
        raw: true
      })
      const tweet = await tweetServices.getOne((newTweet.id))
      return res.status(200).json(tweet)
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
