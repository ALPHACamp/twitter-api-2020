const helpers = require('../_helpers.js')
const { sequelize } = require('../models')

const dateFieldsToTimestamp = (table) => {
  return [
    [sequelize.literal(`UNIX_TIMESTAMP(${table}.createdAt) * 1000`), 'createdAt'],
    [sequelize.literal(`UNIX_TIMESTAMP(${table}.updatedAt) * 1000`), 'updatedAt']
  ]
}

const repliesAndLikeCount = () => {
  return [
    [sequelize.literal(`(SELECT COUNT(*) FROM Likes AS l WHERE l.TweetId=Tweet.id)`), 'likesCount'],
    [sequelize.literal(`(SELECT COUNT(*) FROM Replies AS r WHERE r.TweetId=Tweet.id)`), 'repliesCount']
  ]
}

const tagIsFollowed = (req, user) => {
  //user should be plain object
  return {
    ...user,
    isFollowed: helpers.getUser(req).Followings.includes(user.id)
  }
}









module.exports = {
  dateFieldsToTimestamp,
  tagIsFollowed,
  repliesAndLikeCount,
}