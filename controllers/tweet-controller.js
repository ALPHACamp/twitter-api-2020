const { Tweet, User, Like, Reply } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        order: [['createdAt', 'DESC']],
        include: [User, Reply, Like, { model: User, as: 'LikedUsers' }],
      })
      
      const tweetsData = tweets.reduce((result, tweet) => {
        const { id, UserId, description, createdAt, User, Replies, Likes, LikedUsers } = tweet
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
          isLike: LikedUsers.some((u) => u.id === helpers.getUser(req).id),
        })
        return result
      }, [])
      return res.status(200).json(tweetsData)
    } catch (err) {
      next(err)
    }
  },
}


module.exports = tweetController