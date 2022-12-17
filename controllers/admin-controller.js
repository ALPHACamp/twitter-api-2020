const { User, sequelize } = require('../models')
const adminController = {
  getUsers: (req, res, next) => {
    return User.findAll({
      attributes: [
        'id', 'account', 'name', 'avatar', 'cover',
        [sequelize.literal('(SELECT COUNT (*) FROM Tweets WHERE Tweets.User_id = User.id)'), 'tweetCount'],
        [sequelize.literal('(SELECT COUNT (*) FROM Likes WHERE Likes.User_id = User.id)'), 'likeCount'],
        [sequelize.literal('(SELECT COUNT (*) FROM Followships WHERE Followships.follower_id = User.id)'), 'followingCount'],
        [sequelize.literal('(SELECT COUNT (*) FROM Followships WHERE Followships.following_id = User.id)'), 'followerCount']
      ]
    })
      .then(users => {
        res.status(200).json(users)
      })
      .catch(err => next(err))
  }

}

module.exports = adminController
