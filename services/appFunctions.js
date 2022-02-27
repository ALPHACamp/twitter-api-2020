const { Like, Followship } = require('../models')

module.exports = {
  resTweetHandler: async function (userId, tweet) {
    const resTweet = await this.getTweetIsLiked(userId, tweet)
    resTweet.likeCount = await this.getTweetLikedCount(tweet)
    return this.numToUnitHandler(resTweet)
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
  numToUnitHandler: function (items) {
    const checkList = ['tweetCount', 'likeCount', 'replyCount', 'following', 'followers']
    if (Array.isArray(items)) {
      items.forEach(item => {
        numToUnit(item, checkList)
      })
    } else {
      numToUnit(items, checkList)
    }
    return items
    function numToUnit (item, checkList) {
      checkList.forEach(key => {
        if (item[key]) {
          item[key] = cutNumber(item[key], 1000, 'k', 1)
        }
      })
      return item
    }
    function cutNumber (num, unitAmount, unit, decimal) {
      if (num > unitAmount) {
        const newNum = Math.round(num / (unitAmount / Math.pow(10, decimal))) / Math.pow(10, decimal)
        return `${newNum}${unit}`
      }
      return num
    }
  }
}
