const { Tweet, User, Like, Reply } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        order: [['createdAt', 'DESC']],
        include: [User, Reply, Like, { model: User, as: 'LikedUsers' }]
      })

      const tweetsData = tweets.reduce((result, tweet) => {
        const {
          id,
          UserId,
          description,
          createdAt,
          User,
          Replies,
          Likes,
          LikedUsers
        } = tweet
        result.push({
          id,
          UserId,
          description,
          createdAt,
          name: User.name,
          account: User.account,
          avatar: User.avatar,
          repliedCount: Replies.length,
          likedCount: Likes.length,
          isLike: LikedUsers.some((u) => u.id === helpers.getUser(req).id)
        })
        return result
      }, [])
      return res.status(200).json(tweetsData)
    } catch (err) {
      next(err)
    }
  },
  getTweet: async (req, res, next) => {
    try {
      const { tweetId } = req.params
      const tweet = await Tweet.findByPk(tweetId, {
        include: [User, Reply, Like, { model: User, as: 'LikedUsers' }]
      })

      if (!tweet) {
        return res.status(404).json({
          status: 'error',
          message: 'Tweet not found!'
        })
      }

      const tweetData = {
        id: tweet.id,
        UserId: tweet.UserId,
        description: tweet.description,
        createdAt: tweet.createdAt,
        account: tweet.User.account,
        name: tweet.User.name,
        avatar: tweet.User.avatar,
        repliedCount: tweet.Replies.length,
        likedCount: tweet.Likes.length,
        isLike: tweet.LikedUsers.some((u) => u.id === helpers.getUser(req).id)
      }
      return res.status(200).json({
        status: 'success',
        message: 'Successfully retrieved this Tweet.',
        ...tweetData
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
