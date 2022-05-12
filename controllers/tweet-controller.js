const { Tweet } = require('../models')
const tweetController = {
  create: async (req, res, next) => {
    try {
      const userId = req.user.id || 1
      await Tweet.create({
        userId,
        description: req.body.description
      })
      res.sendStatus(200)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
