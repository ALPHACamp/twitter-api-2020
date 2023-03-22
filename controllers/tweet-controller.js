const { Tweet, User, Like, Reply, sequelize } = require('../models')

const tweetController = {
  // 要取得所有貼文，每則貼文要拿到user的name跟account，還有每則貼文的按讚數/回覆數量，去關聯Like/Reply
  // 感覺要用raw SQL語法
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        nest: true,
        raw: true,
        include: {
          model: User,
          attributes: ['id', 'account', 'name', 'avatar']
        },
        attributes: [
          'id', 'description', 'createdAt',
          [sequelize.literal('(SELECT COUNT(id) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'replyCounts'],
          [sequelize.literal('(SELECT COUNT(id) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'likeCounts']
        ],
        order: [['createdAt', 'DESC']]
      })
      return res.json({ status: 'success', tweets })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController

// getTweets: (req, res, next) => {
//   return Tweet.findAll({
//     include: [User, Like, Reply],
//     raw: true
//   })
//     .then(tweets => {
//       res.json({ status: 'success', tweets })
//     })
//     .catch(err => next(err))
// }
