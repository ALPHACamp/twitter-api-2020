const { Like, Followship } = require('../models')

module.exports = {
  resTweetHandler: async function (userId, tweets) {
    const resTweets = await this.getTweetsIsLiked(userId, tweets)
    return this.numToUnitHandler(resTweets)
  },
  getTweetsIsLiked: async function (userId, tweets) {
    const userLikes = await Like.findAll({
      where: { UserId: userId },
      raw: true
    })
    const userLikeTweetsId = userLikes.map(like => like.TweetId)
    if (Array.isArray(tweets)) {
      tweets.forEach(tweet => {
        tweet.isLiked = userLikeTweetsId.includes(tweet.id)
      })
    } else {
      tweets.isLiked = userLikeTweetsId.includes(tweets.id)
    }
    return tweets
  },
  getUsersIsFollowing: async function (userId, users) {
    const userFollowings = await Followship.findAll({
      where: { followerId: userId },
      raw: true
    })
    const userFollowingUsersId = userFollowings.map(followship => followship.followingId)
    if (Array.isArray(users)) {
      users.forEach(user => {
        user.isFollowing = userFollowingUsersId.includes(user.id)
        user.isUser = Boolean(user.id === userId)
      })
    } else {
      users.isFollowing = userFollowingUsersId.includes(users.id)
      users.isUser = Boolean(users.id === userId)
    }
    return users
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
