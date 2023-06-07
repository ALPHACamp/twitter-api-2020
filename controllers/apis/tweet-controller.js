const { getUser } = require('../../_helpers')
const { Tweet } = require('../../models')

const tweetController = {
  postTweet: async (req, res, next) => {
    try {
      console.log('Now is tweet controller')
      console.log(res.locals.userId)
      return res.json({ status: 'Now tweet is success' })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = tweetController
