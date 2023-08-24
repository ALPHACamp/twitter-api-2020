const { Tweet, Like } = require('../../models')
const helpers = require('../../_helpers')

const tweetContorller = {
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        raw: true
      })
      if (!tweets) throw new Error("Tweet didn't exist!")
      res.json({
        status: 'success',
        data: tweets
      })
    } catch (err) {
      next(err)
    }
  },
  getTweet: async (req, res, next) => {
    try {
      const tweetId = req.params.tweet_id
      const tweet = await Tweet.findByPk(tweetId)

      if (!tweet) throw new Error("Tweet didn't exist!")
      res.json({
        status: 'success',
        data: tweet
      })
    } catch (err) {
      next(err)
    }
  },
  likeTweet: async (req, res, next) => {
    try {
      const tweetId = req.params.tweet_id
      const getUser = helpers.getUser(req)
      const userId = getUser.id
      const [tweet, like] = await Promise.all([
        Tweet.findByPk(tweetId),
        Like.findOne({
          where: {
            userId,
            tweetId
          }
        })
      ])
      if (!tweet) throw new Error("Tweet didn't exist!")
      if (like) throw new Error('You have liked this tweet!')
      const createdLike = await Like.create({
        userId,
        tweetId
      })
      res.json({
        status: 'success',
        data: createdLike
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetContorller
