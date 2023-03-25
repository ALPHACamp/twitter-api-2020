const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const assert = require('assert')

const helpers = require('../_helpers')
const { User, Tweet, Reply, Like, Followship, sequelize } = require('../models')
const { Op } = require('sequelize')

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
          isFollowed: Boolean(user.dataValues.isFollowed)
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
  },
  getRepliesOfUser: (req, cb) => {
    const UserId = req.params.userId
    return Reply.findAll({
      where: {
        UserId
      },
      include: [{
        model: User,
        attributes: {
          exclude: ['password']
        }
      }, {
        model: Tweet, include: [{ model: User, attributes: [['account', 'ownerAccount'], ['name', 'ownerName']] }]
      }],
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true
    })
      .then(repliesOfTweet => {
        assert(repliesOfTweet, '此使用者沒有回覆的推文！')
        cb(null, repliesOfTweet)
      })
      .catch(err => cb(err))
  },
  getLikesOfUser: (req, cb) => {
    const UserId = req.params.userId
    return Like.findAll({
      where: {
        UserId
      },
      order: [[{ model: Tweet }, 'createdAt', 'DESC']],
      raw: true,
      nest: true,
      include: [
        {
          model: Tweet,
          where: { id: { [Op.ne]: null } },
          attributes: {
            include: [
              [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.Tweet_id = Tweet.id)'), 'totalReplies'],
              [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.Tweet_id = Tweet.id)'), 'totalLikes'],
              [sequelize.literal(`EXISTS(SELECT true FROM Likes WHERE Likes.User_Id = ${helpers.getUser(req).id} AND Likes.Tweet_Id = Tweet.id)`), 'isLiked']
            ]
          },
          include: [{ model: User, attributes: { exclude: ['password'] } }]
        }
      ]
    })
      .then(likes => {
        assert(likes, '此使用者沒有喜歡的推文！')
        console.log(likes)
        const result = likes.map(f => ({
          ...f,
          isLiked: Boolean(f.Tweet.isLiked)
        }))
        cb(null, result)
      })
      .catch(err => cb(err))
  },
  getFollowingsOfUser: (req, cb) => {
    const currentUser = helpers.getUser(req)
    return User.findAll({
      where: { id: req.params.userId },
      attributes: [],
      include: [{
        model: User,
        as: 'Followings',
        attributes: {
          exclude: ['password'],
          include: [
            [
              sequelize.literal(`EXISTS (SELECT 1 FROM Followships WHERE follower_id = ${currentUser.id} AND following_id = Followings.id)`),
              'isFollowed'
            ]
          ]
        }
      }],
      order: [[{ model: User, as: 'Followings' }, Followship, 'createdAt', 'DESC']],
      raw: true,
      nest: true
    })
      .then(followings => {
        assert(followings, '此使用者沒有追蹤的使用者！')

        const result = followings.map(f => ({
          followingId: f.Followings.id,
          ...f.Followings,
          isFollowed: Boolean(f.Followings.isFollowed)
        }))
        cb(null, result)
      })
      .catch(err => cb(err))
  },
  getFollowersOfUser: (req, cb) => {
    const currentUser = helpers.getUser(req)
    return User.findAll({
      where: { id: req.params.userId },
      attributes: [],
      include: [{
        model: User,
        as: 'Followers',
        attributes: {
          exclude: ['password'],
          include: [
            [
              sequelize.literal(`EXISTS (SELECT 1 FROM Followships WHERE follower_id = ${currentUser.id} AND following_id = Followers.id)`),
              'isFollowed'
            ]
          ]
        }
      }],
      order: [[{ model: User, as: 'Followers' }, Followship, 'createdAt', 'DESC']],
      raw: true,
      nest: true
    })
      .then(followers => {
        assert(followers, '此使用者沒有被使用者追蹤！')
        const result = followers.map(f => ({
          followerId: f.Followers.id,
          ...f.Followers,
          isFollowed: Boolean(f.Followers.isFollowed)
        }))
        cb(null, result)
      })
      .catch(err => cb(err))
  }
}

module.exports = userService
