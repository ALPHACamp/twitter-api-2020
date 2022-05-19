const { Tweet } = require('../models')
const tweetServices = require('../services/tweets')
const helpers = require('../_helpers')

const tweetController = {
  getAll: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id
      const tweets = await tweetServices.getAll(UserId)
      if (!tweets.length) throw new Error('現在沒有推文')
      res.status(200).json(tweets)
    } catch (err) {
      next(err)
    }
  },
  create: async (req, res, next) => {
    try {
      const user = helpers.getUser(req)
      const description = req.body.description
      const blank = (new Set(description))
      if (description.length > 140) throw new Error('字數超過 140')
      if (blank.has(' ') || !description.length) throw new Error('推文內容不可空白')
      await Tweet.create({
        UserId: user.id,
        description
      })
      const tweets = await tweetServices.getAll(user.id)
      return res.status(200).json(tweets)
    } catch (err) {
      next(err)
    }
  },
  getOne: async (req, res) => {
    try {
      const tweetId = Number(req.params.id)
      const UserId = helpers.getUser(req).id
      const tweet = await tweetServices.getOne(tweetId, UserId)
      if (!tweet) throw new Error('沒有這篇推文')
      res.status(200).json(tweet)
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = tweetController
