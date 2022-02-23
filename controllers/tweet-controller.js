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
  }
}