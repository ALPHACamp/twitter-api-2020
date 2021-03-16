const { User, Tweet, Reply, Like, sequelize } = require('../models')

const includeCountData = () => {
  return [
    [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'likeCount'],
    [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'replyCount'],
  ]
}
const includeUserData = () => ({ model: User, attributes: ['id', 'name', 'account', 'email', 'avatar', "isAdmin"] })

module.exports = {
  includeCountData,
  includeUserData
}