const helpers = require('../_helpers')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Like = db.Like

const adminController = {
  readUsers: (req, res) => {
    User.findAll({
      where: { role: 'user' },
      include: [
        Tweet,
        Like,
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
      ]
    }).then(users => {
      users = users.map(user => ({
        ...(Object.fromEntries(Object.entries(user.dataValues).slice(0, 11))),
        tweetsCount: user.dataValues.Tweets.length,
        likesCount: user.dataValues.Likes.length,
        followersCount: user.dataValues.Followers.length,
        followingsCount: user.dataValues.Followings.length
      }))
      users = users.sort((a, b) => b.tweetsCount - a.tweetsCount)
      return res.json(users)
    }).catch(err => console.error(err))
  },
  deleteTweet: (req, res) => {

  }
}

module.exports = adminController
