const { Tweet, User, Reply } = require('../models')

const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        include: [
          { model: User },
          { model: Reply },
          { model: User, as: 'LikedUsers' }
        ],
        order: [['createdAt', 'DESC']]
      })
      const data = tweets.map(tweet => ({
        ...tweet.toJSON(),
        repliesAmount: tweet.Replies.length || 0,
        likesAmount: tweet.LikedUsers.length || 0
      }))

      res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },
  postTweet: async (req, res, next) => {
    try {
      const { description } = req.body

      if (!description) {
        throw new Error('內容不可空白！')
      } else if (description.length > 140) throw new Error('推文字數不可超過140字！')

      const tweet = await Tweet.create({
        description,
        UserId: req.user.id
      })

      return res.status(200).json({
        status: 'success',
        message: '成功發佈推文！',
        tweet
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
