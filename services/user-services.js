const jwt = require('jsonwebtoken')
const { getUser } = require('../_helpers')
const db = require('../models')
const { User, sequelize } = db

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
              sequelize.literal('(SELECT COUNT(*)FROM Tweets WHERE UserId = User.id)'), 'TweetsCounts'
            ],
            [
              sequelize.literal('(SELECT COUNT(*)FROM Followships AS Followers WHERE followingId = User.id)'), 'followerCounts'
            ],
            [
              sequelize.literal('(SELECT COUNT(*)FROM Followships AS Followings WHERE followerId = User.id)'), 'followingCounts'
            ],
            [
              sequelize.literal('(SELECT COUNT(*)FROM Likes INNER JOIN Tweets ON Tweets.id = Likes.tweetId WHERE Tweets.UserId = User.id )'), 'LikedCounts'
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
  }
}
module.exports = adminServices
