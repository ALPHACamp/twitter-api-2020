const db = require('../models')
const { Like } = db

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

module.exports = { getLoginUserLikedTweetsId }