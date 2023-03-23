const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const assert = require('assert')

const helpers = require('../_helpers')
const { User, Tweet, Reply, Like, sequelize } = require('../models')

const userService = {
  signUp: (req, cb) => {
    const { account, name, email, password, checkPassword } = req.body
    // 檢查email格式用的 function
    const checkEmail = data => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailPattern.test(data)
    }
    // 檢查name的長度
    const checkNameLength = name.length
    // 使用assert來做判斷錯誤地拋出與否
    assert(account && name && email && password && checkPassword, '所有欄位皆須填寫')
    assert(checkNameLength <= 50, 'name 字數超出上限50字')
    assert(checkEmail(email), 'Email格式錯誤')
    assert(password === checkPassword, '密碼與確認密碼不一致')
    Promise.all([
      User.findOne({ where: { account: req.body.account } }),
      User.findOne({ where: { email: req.body.email } })
    ])
      .then(([checkAccount, checkEmail]) => {
        assert(!checkAccount, 'account 已重複註冊！')
        assert(!checkEmail, 'email 已重複註冊！')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        account: req.body.account,
        name: req.body.name,
        email: req.body.email,
        password: hash,
        role: 'user',
        avatar: 'https://i.imgur.com/ZyXrPxB.png',
        cover: 'https://imgur.com/a/lGG5iGQ'
      }))
      .then(signedUser => {
        const userData = signedUser.toJSON()
        delete userData.password
        cb(null, { user: userData })
      })
      .catch(err => cb(err))
  },
  signIn: (req, cb) => {
    try {
      // 按照原始檔給的有提到要引入 helpers 並用 helpers.getUser(req) 來做 req.user的替代
      const userData = helpers.getUser(req).toJSON()
      // if (userData?.role === 'admin') return res.status(403).json({ status: 'error', message: '帳號不存在！' })
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      cb(null, { token, user: userData })
    } catch (err) {
      cb(err)
    }
  },
  getUser: (req, cb) => {
    const userId = helpers.getUser(req).id
    return User.findOne({
      where: { id: req.params.userId },
      attributes: [
        'id',
        'account',
        'name',
        'avatar',
        'introduction',
        'cover',
        [
          sequelize.literal(
            `(EXISTS(SELECT * FROM Followships WHERE Followships.following_id = User.id AND Followships.follower_id = ${userId}))`
          ),
          'isFollowed'
        ],
        [
          sequelize.literal(
            '(SELECT COUNT(*) FROM Followships WHERE Followships.follower_id = User.id)'
          ),
          'followerCounts'
        ],
        [
          sequelize.literal(
            '(SELECT COUNT(*) FROM Followships WHERE Followships.following_id = User.id)'
          ),
          'followingCounts'
        ],
        [
          sequelize.literal(
            '(SELECT COUNT(*) FROM Tweets WHERE Tweets.User_id = User.id)'
          ),
          'tweetsCounts'
        ]
      ]
    })
      .then(user => {
        assert(user, '使用者不存在！')
        const { ...userData } = {
          ...user.toJSON(),
          isFollowed: Boolean(user.isFollowed)
        }
        return cb(null, userData)
      })
      .catch(err => cb(err))
  },
  getTweetsOfUser: (req, cb) => {
    const UserId = req.params.userId
    return Tweet.findAll({
      where: {
        UserId
      },
      include: [{
        model: Like,
        attributes: [[sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('Likes.id'))), 'totalLikes'], [sequelize.literal(`EXISTS (SELECT 1 FROM Likes WHERE User_id = ${helpers.getUser(req).id} AND Tweet_id = Tweet.id)`), 'isLiked']]
      }, {
        model: Reply,
        attributes: [[sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('Replies.id'))), 'totalReplies']]
      }],
      group: 'Tweet.id',
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true
    })
      .then(tweets => {
        assert(tweets, '此使用者沒有推文！')
        const data = tweets.map(t => ({
          ...t,
          isLiked: Boolean(t.Likes.isLiked)
        }))
        cb(null, data)
      })
      .catch(err => cb(err))
  }
}

module.exports = userService
