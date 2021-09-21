const db = require('../models')
const { Like, RoomUser, User } = db
const sequelize = require('sequelize')

async function getLoginUserLikedTweetsId(req) {
  let likedTweets = await Like.findAll({
    raw: true,
    attributes: ['TweetId'],
    where: {
      UserId: req.user.id
    },
  })
  likedTweets = likedTweets.map(tweet => (tweet.TweetId))
  return likedTweets
}

async function getRoomUsers(RoomId) {
  try {
    return await RoomUser.findAll({
      raw: true, nest: true,
      attributes: [
        [sequelize.fn('DISTINCT', sequelize.col('UserId')), 'UserId'],
      ],
      where: { RoomId },
      include: { model: User, attributes: ['name', 'account', 'avatar'] }
    })
  } catch (err) {
    console.warn(err)
  }
}

module.exports = { getLoginUserLikedTweetsId, getRoomUsers }