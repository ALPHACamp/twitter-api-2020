const { Like, Followship } = require('../models')

module.exports = {
  resTweetHandler: async function (userId, tweet) {
    const resTweet = await this.getTweetIsLiked(userId, tweet)
    resTweet.likeCount = await this.getTweetLikedCount(tweet)
    return resTweet
  },
  getTweetIsLiked: async function (userId, tweet) {
    const userLiked = await Like.findOne({
      where: { UserId: userId, TweetId: tweet.id },
      raw: true
    })
    tweet.isLiked = Boolean(userLiked)
    return tweet
  },
  getTweetLikedCount: async function (tweet) {
    const likes = await Like.findAndCountAll({
      where: { TweetId: tweet.id },
      raw: true,
      nest: true
    })
    return likes.count
  },
  getUserIsFollowing: async function (userId, targetId) {
    const followship = await Followship.findOne({
      where: {
        followingId: targetId,
        followerId: userId
      }
    })
    return Boolean(followship)
  },
  resRepliesHandler: replies => {
    replies.map(reply => {
      reply.replyTo = reply.Tweet.User.account
      delete reply.Tweet
      return reply
    })
    return replies
  }
}
