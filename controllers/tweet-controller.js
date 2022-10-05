const { Tweet, User, Like, Reply, sequelize } = require('../models')
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
  },
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
  },
  getTweetReplies: async (req, res, next) => {
    try {
      const tweetId = Number(req.params.tweet_id)
      const replies = await Reply.findAll({
        where: { TweetId: tweetId },
        attributes: ['id', 'comment', 'createdAt'],
        include: [
          { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
          { model: Tweet, attributes: ['id'], include: { model: User, attributes: ['id', 'account'] } }
        ],
        order: [['createdAt', 'DESC']],
        nest: true,
        raw: true
      })
      res.status(200).json(replies)
      } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
