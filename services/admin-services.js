const jwt = require('jsonwebtoken')
const { getUser } = require('../_helpers')
const db = require('../models')
const { User, sequelize, Tweet } = db
const adminServices = {
  signIn: (req, cb) => {
    const userData = getUser(req).toJSON()
    delete userData.password
    try {
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      return cb(null, {
        status: 'success',
        message: '成功登入',
        data: {
          token,
          userData
        }
      })
    } catch (err) {
      cb(err)
    }
  },
  getUsers: (req, cb) => {
    return User.findAll({
      // where: { role: 'user' },
      attributes: {
        include: [
          [
            sequelize.literal(`(SELECT COUNT(*)FROM Tweets WHERE User_id = User.id
                )`), 'TweetsCounts'
          ],
          [
            sequelize.literal(`(SELECT COUNT(*)FROM Followships AS Followers WHERE following_id = User.id
                )`), 'followerCounts'
          ],
          [
            sequelize.literal(`(SELECT COUNT(*)FROM Followships AS Followings WHERE follower_id = User.id
                )`), 'followingCounts'
          ],
          [
            sequelize.literal(`(SELECT COUNT(*)FROM Likes INNER JOIN Tweets ON Tweets.id = Likes.tweet_id WHERE Tweets.User_id = User.id 
            )`), 'LikedCounts'
          ]
        ],
        exclude: [
          'introduction',
          'password',
          'updatedAt',
          'createdAt'
        ]
      },
      order: [
        [sequelize.literal('tweetsCounts'), 'DESC']
      ],
      raw: true,
      nest: true
    })
      .then(users => cb(null, users
      ))
      .catch(err => cb(err))
  },
  getTweets: (req, cb) => {
    return Tweet.findAll({
      include: [{ model: User, attributes: ['id', 'account', 'name', 'avatar'] }],
      order: [['createdAt', 'DESC']]
    })
      .then(tweets => {
        cb(null, {
          status: 'success',
          data: {
            tweetsData: [
              ...tweets
            ]
          }
        })
      })
      .catch(err => cb(err))
  }

}
module.exports = adminServices
