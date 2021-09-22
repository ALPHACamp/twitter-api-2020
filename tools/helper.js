const db = require('../models')
const { Like, User } = db

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

async function getFollowingList(req) {
  let user = await User.findOne({
    attributes: [],
    where: { id: req.user.id },
    include: {
      model: User, as: 'Followings',
      attributes: ['id'], through: { attributes: [] }
    }
  })
  user = user.toJSON()
  return user.Followings.map(user => (user.id)) //[1,5]
}

module.exports = { getLoginUserLikedTweetsId, getFollowingList }