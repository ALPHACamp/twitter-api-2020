const { User, Tweet, Reply, Like } = require('../models')
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

      const tweet = await Tweet.findByPk(TweetId, { 
        include: [User, Reply, Like] 
      })
      if (!tweet) throw new Error('這則推文已不存在!')

      const user = await User.findByPk(tweet.User.id)
      if (!user) throw new Error('這位使用者不存在，刪除推文動作失敗!')

      // minus both totalTweets and totalLiked numbers,
      // and then also remove both tweet, replies, and likes
      const [removedTweet] = await Promise.all([
        tweet.destroy(),
        user.decrement('totalTweets', { by: 1 }),
        user.decrement('totalLiked', { by: tweet.totalLikes }),
        Reply.destroy({
          where: { id: { [Op.in]: tweet.Replies.map(r => r.id) } }
        }),
        Like.destroy({
          where: { id: { [Op.in]: tweet.Likes.map(l => l.id) } }
        })
      ])

      // remove unnecessary key properties
      const responseData = removedTweet.toJSON()
      delete responseData.User
      delete responseData.Replies
      delete responseData.Likes

      return res.status(200).json(responseData)

    } catch (err) { next(err) }
  }
}