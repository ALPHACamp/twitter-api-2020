const { Tweet, User, Like, sequelize } = require('../models')
const helpers = require('../_helpers')
const tweetController = {
  getTweet: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id
      const tweetId = Number(req.params.id)
      const tweet = await Tweet.findOne({
        where: { id: tweetId },
        include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar'] }],
        attributes: ['id', 'description', 'createdAt',
          [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'replyCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'likeCount']
        ],
        raw: true,
        nest: true
      })
      // error code 404
      if (!tweet) {
        return res.status(404).json({
          status: 'error',
          message: 'The tweet does not exist.'
        })
      }
      const likes = await Like.findAll({
        where: { tweetId },
        attributes: ['UserId'],
        nest: true,
        raw: true
      })
      const currentUserLikedTweetsId = new Set()
      likes.forEach(like => currentUserLikedTweetsId.add(like.UserId))
      tweet.isLiked = currentUserLikedTweetsId.has(currentUserId)
      return res.status(200).json(tweet)
    } catch (err) {
      return next(err)
    }
  }
}

module.exports = tweetController
