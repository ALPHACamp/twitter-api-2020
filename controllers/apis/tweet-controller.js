const { Tweet, Reply, Like } = require('../../models')

const tweetController = {
  postTweet: async (req, res, next) => {
    try {
      const { description } = req.body
      const tweet = await Tweet.create({
        UserId: res.locals.userId,
        description
      })
      return res.json({ status: 'success', data: tweet })
    } catch (error) {
      next(error)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll()
      if (!tweets) return res.json({ status: 'error', data: 'There is no tweet' })
      return res.json({ status: 'success', data: tweets })
    } catch (error) {
      next(error)
    }
  },
  getTweet: async (req, res, next) => {
    try {
      const { tweet_id } = req.params
      const tweet = await Tweet.findByPk(tweet_id)
      if (!tweet) return res.json({ status: 'error', data: 'The tweet does not exist' })

      return res.json({ status: 'success', data: tweet })
    } catch (error) {
      next(error)
    }
  },
  postReply: async (req, res, next) => {
    try {
      const { tweet_id } = req.params
      const { comment } = req.body
      const tweet = await Tweet.findByPk(tweet_id)
      if (!tweet) return res.json({ status: 'error', data: 'The tweet does not exist' })

      const reply = await Reply.create({
        UserId: res.locals.userId,
        TweetId: tweet_id,
        comment
      })
      return res.json({ status: 'success', data: reply })
    } catch (error) {
      next(error)
    }
  },
  getReply: async (req, res, next) => {
    try {
      const { tweet_id } = req.params
      const tweet = await Tweet.findByPk(tweet_id)
      if (!tweet) return res.json({ status: 'error', data: 'The tweet does not exist' })

      const replies = await Reply.findAll({
        where: { TweetId: tweet_id },
        raw: true,
        nest: true
      })
      return res.json({ status: 'success', data: replies })
    } catch (error) {
      next(error)
    }
  },
  likeTweet: async (req, res, next) => {
    try {
      const { id } = req.params
      const PromiseArr = await Promise.all(
        [
          Tweet.findByPk(id),
          Like.findOne({
            where: {
              UserId: res.locals.userId,
              TweetId: id
            }
          })
        ])
      if (!PromiseArr[0]) return res.json({ status: 'error', data: 'The tweet does not exist' })
      if (PromiseArr[1]) return res.json({ status: 'error', data: 'The like already exists' })

      const like = await Like.create({
        UserId: res.locals.userId,
        TweetId: id
      })
      return res.json({ status: 'success', data: like })
    } catch (error) {
      next(error)
    }
  },
  unlikeTweet: async (req, res, next) => {
    try {
      const { id } = req.params
      const tweet = await Tweet.findByPk(id)
      if (!tweet) return res.json({ status: 'error', data: 'The tweet does not exist' })
      const like = await Like.findOne({
        where: {
          UserId: res.locals.userId,
          TweetId: id
        }
      })
      if (!like) return res.json({ status: 'error', data: 'The like does not exist' })
      await like.destroy()
      return res.json({ status: 'success', data: like })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
