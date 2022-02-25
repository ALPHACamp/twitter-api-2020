const { Like } = require('../models')

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
  }
}
