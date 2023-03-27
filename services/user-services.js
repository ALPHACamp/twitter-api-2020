const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const assert = require('assert')

const helpers = require('../_helpers')
const { User, Tweet, Reply, Like, Followship, sequelize } = require('../models')
const { Op } = require('sequelize')
const { relativeTimeFromNow } = require('../helpers/dayjs-helpers')
const { imgurFileHandler } = require('../helpers/file-helpers')

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
        cover: 'https://i.imgur.com/jXE6Mmp.png'
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
      assert(userData.role !== 'admin', '帳號不存在！')
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
        'email',
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
    const userId = req.params.userId
    const currentUserId = helpers.getUser(req).id

    return Tweet.findAll({
      attributes: [
        'id', 'description', 'createdAt', 'updatedAt',
        [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Tweet_id = Tweet.id)'), 'totalReplies'],
        [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Tweet_id = Tweet.id)'), 'totalLikes'],
        [sequelize.literal(`EXISTS (SELECT id FROM Likes WHERE Tweet_id = Tweet.id AND User_id = ${currentUserId})`), 'isLiked']
      ],
      where: {
        UserId: userId
      },
      include: [
        { model: User, attributes: ['id', 'name', 'account', 'avatar'] }
      ],
      order: [['createdAt', 'DESC']],
      nest: true,
      raw: true
    })
      .then(tweetsData => {
        const tweets = tweetsData.map(t => ({
          ...t,
          transferDateTime: relativeTimeFromNow(t.createdAt),
          isLiked: t.isLiked === 1
        }))
        cb(null, tweets)
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
        model: Tweet, include: [{ model: User, attributes: [['account', 'ownerAccount'], ['name', 'ownerName'], ['avatar', 'ownerAvatar']] }]
      }],
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true
    })
      .then(repliesOfTweet => {
        assert(repliesOfTweet, '此使用者沒有回覆的推文！')
        const data = repliesOfTweet.map(t => ({
          ...t,
          transferDateTime: relativeTimeFromNow(t.createdAt)
        }))
        cb(null, data)
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
        const result = likes.map(f => ({
          ...f,
          transferDateTime: relativeTimeFromNow(f.Tweet.createdAt),
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
  },
  getTopUsers: (req, cb) => {
    const userId = helpers.getUser(req).id
    return User.findAll({
      where: { role: 'user' },
      attributes: ['id', 'name', 'account', 'avatar',
        [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.following_id = User.id)'), 'followerCounts'],
        [sequelize.literal(`(EXISTS(SELECT * FROM Followships WHERE Followships.following_id = User.id AND Followships.follower_id = ${userId}))`), 'isFollowed']
      ],
      order: [[sequelize.literal('followerCounts'), 'DESC']],
      raw: true,
      nest: true
    })
      .then(topUsers => {
        assert(topUsers => '資料庫發生錯誤')
        let result = topUsers.map(f => ({
          ...f,
          isFollowed: Boolean(f.isFollowed)
        }))
        result = result.slice(0, 10)
        cb(null, { result })
      })
      .catch(err => cb(err))
  },
  editUser: (req, cb) => {
    assert(Number(req.params.userId) === helpers.getUser(req).id, '不可修改其他使用者的資料！')
    const { name, introduction } = req.body
    assert(name, '使用者名稱為必填！')
    const checkNameLength = req.body.name.length
    assert(checkNameLength <= 50, '字數超過上限')
    const checkIntroductionLength = req.body.introduction.length
    assert(checkIntroductionLength <= 160, '字數超過上限')
    const avatarFile = req.files?.avatar ? req.files.avatar[0] : null
    const coverFile = req.files?.cover ? req.files.cover[0] : null
    return Promise.all([
      imgurFileHandler(avatarFile),
      imgurFileHandler(coverFile),
      User.findByPk(req.params.userId)
    ])
      .then(([avatarFilePath, coverFilePath, user]) => {
        return user.update({
          name,
          introduction,
          avatar: avatarFilePath || user.avatar,
          cover: coverFilePath || user.cover
        })
      })
      .then(updatedUser => {
        updatedUser = updatedUser.toJSON()
        delete updatedUser.password
        cb(null, { updatedUser })
      })
      .catch(err => cb(err))
  },
  editSettingofUser: (req, cb) => {
    assert(Number(req.params.userId) === helpers.getUser(req).id, '不可修改其他使用者的資料！')
    const { account, name, email, password, checkPassword } = req.body
    const checkEmail = data => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailPattern.test(data)
    }
    const checkNameLength = name.length
    assert(checkNameLength <= 50, '字數超過上限！')
    assert(password === checkPassword, '密碼與確認密碼不一致')
    assert(checkEmail(email), 'Email格式錯誤')
    assert(account && name && email && password && checkPassword, '所有欄位皆須填寫')
    Promise.all([
      User.findOne({ where: { account: req.body.account } }),
      User.findOne({ where: { email: req.body.email } })
    ])
      .then(([checkAccount, checkEmail]) => {
        assert(!checkAccount, 'account 已重複註冊！')
        assert(!checkEmail, 'email 已重複註冊！')
        return Promise.all([bcrypt.hash(req.body.password, 10), User.findByPk(req.params.userId)])
      })
      .then(([hash, user]) => {
        assert(user, '使用者不存在！')
        return user.update({
          name,
          account,
          email,
          password: hash
        })
      })
      .then(result => {
        const { ...userResult } = {
          ...result.toJSON()
        }
        delete userResult.password
        cb(null, { userResult })
      })
      .catch(err => cb(err))
  }
}

module.exports = userService
