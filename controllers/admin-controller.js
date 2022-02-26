const { User, Tweet, Reply, Like, sequelize } = require('../models')
const { Op } = require('sequelize')

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
        include: { model: User, attributes: { exclude: ['password'] } },
        order: [['createdAt', 'DESC']],
        nest: true
      })
      if (!tweets.length) throw new Error('沒有任何推文!')

      const responseData = tweets.map(tweet => {
        tweet = tweet.toJSON()

        // assign following one object to temp constants
        const tweetedUser = tweet.User
        // remove unnecessary key properties
        delete tweet.User

        return { ...tweet, tweetedUser }
      })

      return res.status(200).json(responseData)

    } catch (err) { next(err) }
  },

  deleteTweet: async (req, res, next) => {
    try {
      const TweetId = Number(req.params.TweetId)

      const tweet = await Tweet.findByPk(TweetId, { 
        include: [User, Reply, Like] 
      })
      if (!tweet) throw new Error('這則推文已不存在!')

      const user = await User.findByPk(tweet.User.id)
      if (!user) throw new Error('這位使用者不存在，刪除推文動作失敗!')

      let responseData = await sequelize.transaction(async (t) => {
        // minus both totalTweets and totalLiked numbers,
        // and then also remove both tweet, replies, and likes
        const [removedTweet] = await Promise.all([
          tweet.destroy({ transaction: t }),
          user.decrement('totalTweets', { by: 1, transaction: t }),
          user.decrement('totalLiked', { by: tweet.totalLikes, transaction: t }),
          Reply.destroy({
            where: { id: { [Op.in]: tweet.Replies.map(r => r.id) } },
            transaction: t
          }),
          Like.destroy({
            where: { id: { [Op.in]: tweet.Likes.map(l => l.id) } },
            transaction: t
          })
        ])
        return removedTweet
      })

      // remove unnecessary key properties
      responseData = responseData.toJSON()
      delete responseData.User
      delete responseData.Replies
      delete responseData.Likes

      return res.status(200).json(responseData)

    } catch (err) { next(err) }
  }
}