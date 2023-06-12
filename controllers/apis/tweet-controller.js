const { User, Tweet, Reply, Like } = require('../../models')

const tweetController = {
  postTweet: async (req, res, next) => {
    try {
      const { description } = req.body
      const tweet = await Tweet.create({
        UserId: res.locals.userId,
        description
      })
      return res.status(200).json(tweet)
    } catch (error) {
      next(error)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        include: [{ model: User, as: 'TweetUser' }],
        order: [['createdAt', 'DESC']]
      })

      // 錯誤處理
      if (!tweets) {
        const error = new Error('There is no tweet')
        error.status = 404
        throw error
      }

      return res.status(200).json(tweets)
    } catch (error) {
      next(error)
    }
  },
  getTweet: async (req, res, next) => {
    try {
      const { tweet_id } = req.params
      const tweet = await Tweet.findByPk(tweet_id, {
        include: [{ model: User, as: 'TweetUser' }]
      })
      if (!tweet) {
        const error = new Error('The tweet does not exist')
        error.status = 404
        throw error
      }

      return res.status(200).json(tweet)
    } catch (error) {
      next(error)
    }
  },
  postReply: async (req, res, next) => {
    try {
      const { tweet_id } = req.params
      const { comment } = req.body
      const tweet = await Tweet.findByPk(tweet_id)

      // 錯誤處理
      if (!tweet) {
        const error = new Error('The tweet does not exist')
        error.status = 404
        throw error
      }

      const reply = await Reply.create({
        UserId: res.locals.userId,
        TweetId: tweet_id,
        comment
      })
      return res.status(200).json(reply)
    } catch (error) {
      next(error)
    }
  },
  getReply: async (req, res, next) => {
    try {
      const { tweet_id } = req.params
      const tweet = await Tweet.findByPk(tweet_id)

      // 錯誤處理
      if (!tweet) {
        const error = new Error('The tweet does not exist')
        error.status = 404
        throw error
      }

      const replies = await Reply.findAll({
        where: { TweetId: tweet_id },
        raw: true,
        nest: true
      })
      return res.status(200).json(replies)
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

      // 錯誤處理
      if (!PromiseArr[0]) {
        const error = new Error('The tweet does not exist')
        error.status = 404
        throw error
      }
      if (PromiseArr[1]) {
        const error = new Error('The tweet does not exist')
        error.status = 409
        throw error
      }

      const like = await Like.create({
        UserId: res.locals.userId,
        TweetId: id
      })
      return res.status(200).json(like)
    } catch (error) {
      next(error)
    }
  },
  unlikeTweet: async (req, res, next) => {
    try {
      const { id } = req.params
      const tweet = await Tweet.findByPk(id)

      // 錯誤處理
      if (!tweet) {
        const error = new Error('The tweet does not exist')
        error.status = 404
        throw error
      }
      const like = await Like.findOne({
        where: {
          UserId: res.locals.userId,
          TweetId: id
        }
      })

      // 錯誤處理
      if (!like) {
        const error = new Error('The like does not exist')
        error.status = 404
        throw error
      }

      await like.destroy()
      return res.status(200).json(like)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
