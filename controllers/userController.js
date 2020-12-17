const helpers = require('../_helpers')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet

const userController = {
  readUser: (req, res) => {
    const id = Number(req.params.id)
    User.findOne({
      where: { id },
      include: [
        Tweet,
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
      ]
    }).then(user => {
      const userObj = Object.fromEntries(Object.entries(user.toJSON()).slice(0, 11))
      userObj.isSelf = (user.id === req.user.id)
      userObj.isFollowed = user.Followers.map(follower => follower.id).includes(helpers.getUser(req).id)
      userObj.tweetsCount = user.Tweets.length
      userObj.followingsCount = user.Followings.length
      userObj.followersCount = user.Followers.length
      return res.json(userObj)
    }).catch(err => console.error(err))
  },
  readTweets: (req, res) => {

  },
  readRepliedTweets: (req, res) => {

  },
  readLikes: (req, res) => {

  },
  readFollowings: (req, res) => {

  },
  readFollowers: (req, res) => {

  },
  updateUser: (req, res) => {

  }
}

module.exports = userController
