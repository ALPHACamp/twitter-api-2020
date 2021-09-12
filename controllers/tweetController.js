const tweetService = require('../services/tweetService')

const tweetController = {
  getTweets: async (req, res) => {
    const tweets = await tweetService.getTweets(req.user.id)

    // Check whether tweets exists
    if (!tweets) {
      return res
        .status(401)
        .json({ status: 'error', message: 'No tweets found' })
    }

    return res.status(200).json(tweets)
  }
}

module.exports = tweetController
