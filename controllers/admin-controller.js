const { User, Tweet } = require('../models')

module.exports = {
  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        where: { role: 'user' },
        order: [['totalTweets', 'DESC']],
        raw: true
      })
      if (!users.length) throw new Error('沒有任何使用者!')

      return res.status(200).json(users)

    } catch (err) { next(err) }
  },

  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        order: [['createdAt', 'DESC']],
        raw: true
      })
      if (!tweets.length) throw new Error('沒有任何推文!')

      return res.status(200).json(tweets)

    } catch (err) { next(err) }
  },

  deleteTweet: async (req, res, next) => {
    try {
      const TweetId = Number(req.params.TweetId)

      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) throw new Error('這則推文已不存在!')

      const responseData = await tweet.destroy()
      return res.status(200).json(responseData)

    } catch (err) { next(err) }
  }
}