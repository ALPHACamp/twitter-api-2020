const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Like = db.Like

const helpers = require('../_helpers')
const { sequelize } = require('../models')

const adminController = {
  getUsers: async (req, res) => {
    let users = await User.findAll({
      where: { role: 'user' },
      include: [
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
        { model: Tweet, include: [Like] }
      ],
      attributes: [
        'id',
        'name',
        'avatar',
        'account',
        'cover',
        [
          sequelize.literal(
            '(SELECT COUNT(*) FROM Tweets WHERE Tweets.UserId = User.id)'
          ),
          'tweetCount'
        ]
      ],
      order: [[sequelize.literal('tweetCount'), 'DESC']]
    })

    // Clean up data
    users = users.map(user => {
      let likeCount = 0
      user.Tweets.forEach(tweet => {
        if (tweet.Likes) {
          likeCount += tweet.Likes.length
        }
      })
      return {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        account: user.account,
        cover: user.cover,
        tweetCount: user.dataValues.tweetCount,
        followerCount: user.Followers.length,
        followingCount: user.Followings.length,
        likeCount
      }
    })
    res.status(200).json(users)
  }
}

module.exports = adminController
