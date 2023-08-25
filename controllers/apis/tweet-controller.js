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
        tweets
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
        data: createdLike,
        Boolean: true
      })
    } catch (err) {
      next(err)
    }
  },
  unlikeTweet: async (req, res, next) => {
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
      if (!like) throw new Error("You haven't liked this tweet!")
      const unlike = await Like.destroy({
        where: {
          userId,
          tweetId
        }
      })
      res.json({
        status: 'success',
        data: unlike,
        Boolean: false
      })
    } catch (err) {
      next(err)
    }
  },
  createTweet: async (req, res, next) => {
    try {
    } catch (err) {
      next(err)
    }
  },
  getReplies: async (req, res, next) => {
    try {
    } catch (err) {
      next(err)
    }
  },
  createReply: async (req, res, next) => {
    try {
    } catch (err) {
      next(err)
    }
  },
  getLikes: async (req, res, next) => {
    try {
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetContorller
