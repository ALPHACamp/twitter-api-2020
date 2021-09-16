const tweetService = require('../services/tweetService')
const {
  joiMessageHandler,
  tweetSchema,
  replySchema
} = require('../utils/validator')
const ApiError = require('../utils/customError')

const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      let tweets = await tweetService.getTweets(req.user.id)

      // Check whether tweets exists
      if (!tweets.length) {
        throw new ApiError('GetTweetsError', 401, 'No tweets found')
      }

      // translate to boolean in isFollowed attribute
      tweets.forEach((tweet) => {
        tweet.isLike = !!tweet.isLike
      })

      return res.status(200).json(tweets)
    } catch (error) {
      next(error)
    }
  },
  getTweet: async (req, res, next) => {
    try {
      let tweet = await tweetService.getTweet(req.user.id, req.params.tweetId)

      // Check whether tweets exists
      if (!tweet) {
        throw new ApiError('GetTweetError', 401, 'No tweet found')
      }

      // translate to boolean in isFollowed attribute
      tweet.dataValues.isLike = !!tweet.dataValues.isLike

      return res.status(200).json(tweet)
    } catch (error) {
      next(error)
    }
  },
  postTweet: async (req, res, next) => {
    try {
      const { description } = req.body
      console.log(description)

      // Check request body data format with Joi schema
      const { error } = tweetSchema.validate(req.body, { abortEarly: false })

      if (error) {
        throw new ApiError(
          'postTweetFormatError',
          400,
          joiMessageHandler(error.details)
        )
      }

      // Create new tweet
      const data = await tweetService.postTweet(req.user.id, description)

      return res.status(200).json(data)
    } catch (error) {
      next(error)
    }
  },
  postLikeTweet: async (req, res, next) => {
    try {
      const data = await tweetService.postLikeTweet(
        req.user.id,
        req.params.tweetId
      )

      return res.status(200).json(data)
    } catch (error) {
      next(error)
    }
  },
  postUnlikeTweet: async (req, res, next) => {
    try {
      const data = await tweetService.postUnlikeTweet(
        req.user.id,
        req.params.tweetId
      )

      return res.status(200).json(data)
    } catch (error) {
      next(error)
    }
  },
  getTweetAllReplies: async (req, res) => {
    const data = await tweetService.getTweetAllReplies(req.params.tweetId)

    return res.status(200).json(data.Replies)
  },
  postReply: async (req, res) => {
    const { comment } = req.body

    // Check request body data format with Joi schema
    const { error } = replySchema.validate(req.body, { abortEarly: false })

    if (error) {
      return res.status(400).json({
        status: 'error',
        message: joiMessageHandler(error.details)
      })
    }

    // Create new reply
    const data = await tweetService.postReply(
      req.user.id,
      req.params.tweetId,
      comment
    )

    return res.status(200).json(data)
  }
}

module.exports = tweetController
