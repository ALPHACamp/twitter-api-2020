const { User, Tweet, sequelize } = require('../models')

const adminController = {
  getAllUsers: async (req, res, next) => {
    try {
      const user = await User.findAll({
        attributes: [
          'name', 'account', 'avatar',
          [sequelize.literal('(SELECT COUNT(DISTINCT id) FROM Tweets WHERE Tweets.User_id = User.id)'),
            'tweetCounts'],
          [sequelize.literal('(SELECT COUNT(DISTINCT id) FROM Replies WHERE Replies.User_id = User.id)'),
            'replyCounts'],
          [sequelize.literal('(SELECT COUNT(DISTINCT id) FROM Likes WHERE Likes.User_id = User.id)'),
            'likeCounts'],
          [sequelize.literal('(SELECT COUNT(DISTINCT id) FROM Followships WHERE Followships.Follower_id = User.id)'),
            'FollowingCounts'],
          [sequelize.literal('(SELECT COUNT(DISTINCT id) FROM Followships WHERE Followships.Following_id = User.id)'), 'FollowerCounts']
        ],
        order: [[sequelize.col('tweetCounts'), 'DESC'], ['created_at']],
        nest: true,
        raw: true
      })
      
      res.json(user)
    } catch (err) {
      next(err)
    }
  },
  deleteTweets: async (req, res, next) => {
    try {
      const deletedTweetId = req.params.id
      const deletedTweet = await Tweet.findByPk(deletedTweetId)

      if (!deletedTweet) throw new Error('無法刪除不存在的推文。')

      const deletedCount = await Tweet.destroy({
        where: {
          id: deletedTweetId
        }
      })

      if (!deletedCount) throw new Error('你已刪除過此推文。')

      res.json({
        status: 'succuss',
        message: '你已成功刪除該筆推文',
        data: {
          deletedTweet, // deleted Twitter
          deletedCount // delete Count
        }
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController