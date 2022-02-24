const helpers = require('../../_helpers')
const { Tweet, Like } = require('../../models')

const tweetController = {
  postTweet: async (req, res, next) => {
    const { description } = req.body
    try {
      if (description.length > 140) throw new Error('推文字數不可大於140字！')
      const tweet = await Tweet.create({
        UserId: helpers.getUser(req).id,
        description
      })
      if (process.env.NODE_ENV === 'test') {
        res.json({ tweet: tweet.toJSON() })
      }
      res.json({
        status: 'success',
        data: { tweet: tweet.toJSON() }
      })
    } catch (err) {
      next(err)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        raw: true,
        nest: true
      })
      if (process.env.NODE_ENV === 'test') {
        res.json(tweets)
      }
      res.json({
        status: 'success',
        data: { tweets }
      })
    } catch (err) {
      next(err)
    }
  },
  getTweet: async (req, res, next) => {
    try {
      const tweet = await Tweet.findOne({
        where: { id: req.params.id },
        raw: true,
        nest: true
      })
      if (process.env.NODE_ENV === 'test') {
        res.json(tweet)
      }
      res.json({
        status: 'success',
        data: { tweet }
      })
    } catch (err) {
      next(err)
    }
  },
  addLike: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id
      const TweetId = req.params.id
      const tweet = await Tweet.findByPk(TweetId)
      const like = await Like.findOne({ where: { UserId, TweetId } })

      if (!tweet) throw new Error("Tweet didn't exist!")
      if (like) throw new Error('You have liked this tweet!')

      const liked = await Like.create({ UserId, TweetId })
      return res.json({
        status: 'success',
        data: {
          ...tweet.toJSON(),
          isLiked: true
        }
      })
    } catch (err) {
      next(err)
    }
  },
  removeLike: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id
      const TweetId = req.params.id
      const tweet = await Tweet.findByPk(TweetId)
      const unliked = await Like.findOne({ where: { UserId, TweetId } })

      if (!tweet) throw new Error("Tweet didn't exist!")
      if (!unliked) throw new Error("You haven't Liked this tweet")

      await unliked.destroy()
      return res.json({
        status: 'success',
        data: {
          ...tweet.toJSON(),
          isLiked: false
        }
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
