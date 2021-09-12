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
  },
  getTweet: async (req, res) => {
    const tweet = await tweetService.getTweet(req.user.id, req.params.tweetId)

    // Check whether tweets exists
    if (!tweet) {
      return res
        .status(401)
        .json({ status: 'error', message: 'No tweet found' })
    }

    return res.status(200).json(tweet)
  },
  postTweet: async (req, res) => {
    const { description } = req.body

    if (!description.trim().length) {
      return res
        .status(401)
        .json({ status: 'error', message: 'The description cannot be blank' })
    }

    if (!description.trim().length > 140) {
      return res.status(401).json({
        status: 'error',
        message: 'The description should not exceed 140 words'
      })
    }

    const data = await tweetService.postTweet(req.user.id, description)

    return res.status(200).json(data)
  },
  postLikeTweet: async (req, res) => {
    const data = await tweetService.postLikeTweet(
      req.user.id,
      req.params.tweetId
    )

    return res.status(200).json(data)
  },
  postUnlikeTweet: async (req, res) => {
    const data = await tweetService.postUnlikeTweet(
      req.user.id,
      req.params.tweetId
    )

    return res.status(200).json(data)
  },
  getTweetAllReplies: async (req, res) => {
    const data = await tweetService.getTweetAllReplies(req.params.tweetId)

    return res.status(200).json(data.Replies)
  }
}

module.exports = tweetController
