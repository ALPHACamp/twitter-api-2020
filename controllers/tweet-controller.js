const { Tweet } = require('../models')
const tweetServices = require('../services/tweets')
const helpers = require('../_helpers')

const tweetController = {
  getAll: async (req, res) => {
    try {
      const tweets = await tweetServices.getAll()
      res.json({
        status: 'success',
        data: {
          tweets
        }
      })
    } catch (err) {
      console.log(err)
    }
  },
  create: async (req, res, next) => {
    try {
      const user = helpers.getUser(req)
      await Tweet.create({
        UserId: user.id,
        description: req.body.description
      })
      res.sendStatus(200)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
