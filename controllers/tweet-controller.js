const { Tweet, User } = require('../models')
const helpers = require('../_helpers')


module.exports = {
  getTweets: async (req, res, next) => {
    try {
      const userId = helpers.getUser(req).id 

      const tweets = await Tweet.findAll({
        include: [
          { model: User },
          { model: User, as: 'UsersFromLikedTweets' }
        ],
        nest: true
      })

      // reassemble tweet array
      const responseData = tweets.map(tweet => {
        tweet = tweet.toJSON()

        // assign following two objects to temp constants
        const tweetedUser = tweet.User
        const usersFromLikedTweets = tweet.UsersFromLikedTweets

        // delete original properties from tweet
        delete tweet.User
        delete tweet.UsersFromLikedTweets

        return {
          ...tweet,
          isLiked: usersFromLikedTweets.some(u => u.id === userId),
          tweetedUser
        }
      })

      return res.status(200).json([...responseData])

    } catch (err) { next(err) }
  },

  getTweet: async (req, res, next) => {
    try {
      const userId = helpers.getUser(req).id
      const { TweetId } = req.params

      let tweet = await Tweet.findByPk(TweetId, {
        include: [
          { model: User },
          { model: User, as: 'UsersFromLikedTweets' }
        ],
        nest: true
      })

      if (!tweet) throw new Error('沒有這則推文!')

      // reassemble tweet array
      tweet = tweet.toJSON()

      // assign following two objects to temp constants
      const tweetedUser = tweet.User
      const usersFromLikedTweets = tweet.UsersFromLikedTweets

      // delete original properties from tweet
      delete tweet.User
      delete tweet.UsersFromLikedTweets

      const responseData = {
        ...tweet,
        isLiked: usersFromLikedTweets.some(u => u.id === userId),
        tweetedUser
      }

      return res.status(200).json({ ...responseData })

    } catch (err) { next(err) }
  },

  postTweet: async (req, res, next) => {
    try {
      const userId = helpers.getUser(req).id
      const description = req.body.description?.trim() || null

      if (!description) throw new Error('推文不能為空!')

      // create tweet, and then find full tweet data from database
      let tweet = await Tweet.create({ description, UserId: userId })
      tweet = await Tweet.findByPk(tweet.id, { raw: true })

      return res.status(200).json({ ...tweet })

    } catch (err) { next(err) }
  }
}