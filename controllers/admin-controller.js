const { User, sequelize } = require('../models')

const adminController = {
  getUsers: (req, res, next) => {
    return User.findAll({
      attributes: ['id', 'avatar', 'cover',
        [sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE Tweets.User_id = User.id)'), 'tweetCount'],
        [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.following_id = User.id)'), 'followerCount'],
        [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.follower_id = User.id)'), 'followingCount'],
        [sequelize.literal('(SELECT COUNT(*) FROM Tweets JOIN Likes ON Tweets.id = Likes.Tweet_id WHERE Tweets.User_id = User.id)'), 'likeCount']
      ],
      order: [[sequelize.literal('tweetCount'), 'DESC']],
      raw: true
    })
      .then(users => res.json(users))
      .catch(error => next(error))
  }
}

module.exports = adminController
