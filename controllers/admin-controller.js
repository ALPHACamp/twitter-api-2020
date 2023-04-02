const { Tweet, User, Sequelize, Reply } = require('../models')
const adminController = {
  // 推文清單(每筆資料顯示推文內容的前50字)
  getTweets: async (_req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        attributes: [
          'id',
          'UserId',
          'description',
          'createdAt',
          'updatedAt',
          [Sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id )'), 'reply_count'],
          [Sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id )'), 'like_count']
        ],
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'account', 'avatar']
          },
          {
            model: Reply,
            attributes: { exclude: 'TweetId' },
            include: [
              {
                model: User,
                attributes: ['id', 'name', 'account', 'avatar']
              }
            ]
          }
        ],
        order: [['updatedAt', 'DESC']],
        nest: true
      })
      const modifiedTweets = tweets.map(tweet => {
        tweet.description = tweet.description.substring(0, 50)
        return tweet
      })
      return res.status(200).json(modifiedTweets)
    } catch (error) {
      return next(error)
    }
  },
  deleteTweet: async (req, res, next) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id)
      if (!tweet) { return res.status(400).json({ status: 'error', message: "Tweet didn't exist!" }) }
      await tweet.destroy()
      return res.json({
        status: 'success',
        message: 'Successfully deleted the tweet',
        data: { tweet }
      })
    } catch (err) {
      next(err)
    }
  },
  getUsers: async (_req, res, next) => {
    try {
      const users = await User.findAll({
        attributes: [
          'id',
          'name',
          'account',
          'avatar',
          'cover',
          'introduction',
          'role',
          [Sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE Tweets.UserId = User.id )'), 'tweet_count'],
          [Sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.FollowerId = User.id )'), 'following_count'],
          [Sequelize.literal('(SELECT COUNT(*) FROM Followships  WHERE Followships.FollowingId = User.id )'), 'follower_count'],
          [Sequelize.literal('(SELECT COUNT(*) FROM Likes JOIN Tweets ON Likes.TweetId = Tweets.id WHERE Tweets.UserId = User.id )'), 'total_like']
        ],
        order: [[Sequelize.literal('tweet_count'), 'DESC']],
        nest: true,
        raw: true
      })
      return res.status(200).json(users)
    } catch (err) {
      next(err)
    }
  }
}
module.exports = adminController
