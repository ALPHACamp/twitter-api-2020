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
  },
  resAdminUsersHandler: users => {
    users.forEach(user => {
      user.tweetCount = cutNumber(user.tweetCount, 1000, 'k', 1)
      user.likeCount = cutNumber(user.tweetCount, 1000, 'k', 1)
      user.following = cutNumber(user.following, 10000, '萬', 1)
      user.followers = cutNumber(user.following, 10000, '萬', 1)
      return user
    })
    return users
    function cutNumber (num, unitAmount, unit, decimal) {
      if (num > unitAmount) {
        const newNum = Math.round(num / (unitAmount / Math.pow(10, decimal)))
        return `${newNum}${unit}`
      }
      return num
    }
  }
}
