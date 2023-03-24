const jwt = require('jsonwebtoken')
const { getUser } = require('../_helpers')
const db = require('../models')
const { User, sequelize, Tweet } = db

const adminServices = {
  postSignIn: (req, cb) => {
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
  getTopUsers: (next, cb) => {
    try {
      User.findAll({
        where: { role: 'user' },
        attributes: {
          include: [
            [
              sequelize.literal('(SELECT COUNT(*)FROM Tweets WHERE User_id = User.id)'), 'TweetsCounts'
            ],
            [
              sequelize.literal('(SELECT COUNT(*)FROM Followships AS Followers WHERE following_id = User.id)'), 'followerCounts'
            ],
            [
              sequelize.literal('(SELECT COUNT(*)FROM Followships AS Followings WHERE follower_id = User.id)'), 'followingCounts'
            ],
            [
              sequelize.literal('(SELECT COUNT(*)FROM Likes INNER JOIN Tweets ON Tweets.id = Likes.tweet_id WHERE Tweets.User_id = User.id)'), 'LikedCounts'
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
          [sequelize.literal('followerCounts'), 'DESC']
        ]
      })
        .then(users => cb(null, {
          status: 'success',
          data: {
            usersData: [...users]
          }
        }))
    } catch (err) {
      next(err)
    }
  },
  postSignUp: (req, cb) => {
    const { account, name, email, password, checkPassword } = req.body
    if (!account || !email || !password || !checkPassword) throw new Error('請填寫必填欄位')
    if (password !== checkPassword) throw new Error('密碼與確認密碼不相符')
    User.findOne({ where: { email } })
      .then(user => {
        if (user) throw new Error('此信箱已被註冊')
        return User.create({
          account,
          name,
          email,
          password,
          role: 'user'
        })
          .then(user => {
            const userData = user.toJSON()
            delete userData.password
            const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
            return cb(null, {
              status: 'success',
              message: '成功註冊',
              data: {
                token,
                userData
              }
            })
          })
      })
      .catch(err => cb(err))
  },
  getUserFailed: (req, cb) => {
    const { id } = req.params
    User.findAll({
      where: {
        id: id,
        role: 'user'
      }
    }, {
      attributes: {
        include: [
          [
            sequelize.literal('(SELECT COUNT(*)FROM Tweets WHERE User_id = User.id)'), 'TweetsCounts'
          ],
          [
            sequelize.literal('(SELECT COUNT(*)FROM Followships AS Followers WHERE following_id = User.id)'), 'followerCounts'
          ],
          [
            sequelize.literal('(SELECT COUNT(*)FROM Followships AS Followings WHERE follower_id = User.id)'), 'followingCounts'
          ],
          [
            sequelize.literal('(SELECT COUNT(*)FROM Likes INNER JOIN Tweets ON Tweets.id = Likes.tweet_id WHERE Tweets.User_id = User.id)'), 'LikedCounts'
          ]
        ],
        exclude: [
          'password',
          'updatedAt',
          'createdAt'
        ]
      },
      raw: true
    })
      .then(user => {
        cb(null, user[0])
      })
      .catch(err => cb(err))
  },
  getUserTweets: (req, cb) => {
    return Tweet.findAll({
      where: { UserId: req.params.id },
      include: [{ model: User, attributes: ['id', 'account', 'name', 'avatar'] }],
      order: [['createdAt', 'DESC']]
    })
      .then(tweets => {
        // tweets = tweets.map(tweet => { return tweet })
        return cb(null, [...tweets])
      })
      .catch(err => cb(err))
  }
}
module.exports = adminServices
