const { Tweet, User, sequelize } = require('../models')
const helpers = require('../_helpers')
const { relativeTime } = require('../helpers/tweet-helpers')

const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id
      const tweets = await Tweet.findAll({
        raw: true,
        nest: true,
        include: {
          model: User,
          attributes: ['id', 'avatar', 'account', 'name']
        },
        attributes: [
          'id',
          'createdAt',
          'description',
          [sequelize.literal('(SELECT COUNT(id) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'replyCount'],
          [sequelize.literal('(SELECT COUNT(id) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'likeCount'],
          [sequelize.literal(`EXISTS (SELECT id FROM Likes WHERE Likes.UserId = ${currentUserId} AND Likes.TweetId = Tweet.id)`), 'isLiked']
        ],
        order: [['createdAt', 'DESC']]
      })
      const data = tweets.map(tweet => ({
        ...tweet,
        createdAt: relativeTime(tweet.createdAt)
      }))
      return res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },
  
}

module.exports = tweetController

// POST	/api/tweets/:id/like	喜歡某則tweet
// POST	/api/tweets/:id/unlike	取消喜歡某則tweet
// POST	/api/tweets/:id/replies	新增回覆
// GET	/api/tweets/:id/replies	讀取回覆
// POST	/api/tweets	新增tweets
// GET	/api/tweets/:id	查看特定tweet
