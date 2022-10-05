const { Tweet, Like, User, sequelize } = require('../models')
const helpers = require('../_helpers')
const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id
      const [userTweets, currentUserLikes] = await Promise.all([
        Tweet.findAll({
          include: { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
          attributes: [
            'id', 'description', 'createdAt',
            [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'replyCount'],
            [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'likeCount']
          ],
          order: [['createdAt', 'DESC']],
          nest: true,
          raw: true
        }),
        Like.findAll({ where: { UserId: currentUserId } })
      ])
      // add isLiked attribute
      const currentUserLikedTweetsId = new Set()
      currentUserLikes.forEach(like => currentUserLikedTweetsId.add(like.TweetId))
      userTweets.forEach(tweet => {
        tweet.isLiked = currentUserLikedTweetsId.has(tweet.id)
      })
      return res.json(userTweets)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
