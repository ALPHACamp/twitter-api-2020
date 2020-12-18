const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User, Tweet, Like, sequelize, Sequelize } = require('../models/index')
const QueryTypes = Sequelize.QueryTypes
const { isEmailValid } = require('../utils/helpers')
const helpers = require('../_helpers')

module.exports = {
  createUser: async (req, res, next) => {
    const errors = []
    //check required fields
    const { account, name, email, password, checkPassword } = req.body
    if (!account.trim() || !name.trim() || !email.trim() || !password.trim() || !checkPassword.trim()) {
      errors.push('所有欄位皆為必填')
    }
    //check if password matches checkPassword
    if (password !== checkPassword) {
      errors.push('密碼和確認密碼不相符')
    }
    //check if the email's format is valid
    if (!isEmailValid(email)) {
      errors.push('Email格式錯誤')
    }

    try {
      const [duplicateAccount, duplicateEmail] = await Promise.all([
        User.findOne({ where: { account } }),
        User.findOne({ where: { email } })
      ])
      if (duplicateAccount) {
        errors.push('帳號重複')
      }
      if (duplicateEmail) {
        errors.push('Email已被註冊')
      }
      if (errors.length) {
        return res.json({ status: 'error', message: errors })
      }

      const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
      await User.create({ account, name, email, password: hash })
      return res.json({ status: 'success', message: '註冊成功' })
    } catch (err) {
      console.log(err)
      return res.status(500).json({ status: 'error', message: '內部伺服器錯誤' })
    }
  },
  login: async (req, res, next) => {
    try {
      const { account, password } = req.body

      if (!account.trim() || !password.trim()) {
        return res.json({ status: 'error', message: '帳號和密碼不可為空白' })
      }

      const user = await User.findOne({ where: { account } })
      if (!user) {
        return res.status(401).json({ status: 'error', message: '帳號或密碼錯誤' }) //in case of brute force attack on email
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: '帳號或密碼錯誤' })
      }

      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.json({
        status: 'success',
        message: '成功登入',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({ status: 'error', message: '內部伺服器錯誤' })
    }
  },
  getUsers: async (req, res, next) => {
    try {
      const users = await sequelize.query(`
        SELECT U.id, U.name, U.account, U.cover, U.avatar, IFNULL(F1.followingCount, 0) AS followingCount, IFNULL(F2.followerCount, 0) AS followerCount, IFNULL(T.tweetCount, 0) AS tweetCount, CAST(IFNULL(L.likedCount, 0) AS UNSIGNED) AS LikedCount
        FROM Users AS U

        LEFT JOIN (SELECT followerId, COUNT(followerId) AS followingCount FROM Followships GROUP BY followerId) AS F1
        ON F1.followerId = U.id

        LEFT JOIN (SELECT followingId, COUNT(followingId) AS followerCount FROM Followships GROUP BY followingId) AS F2
        ON F2.followingId = U.id

        LEFT JOIN (SELECT UserId, COUNT(UserId) AS tweetCount FROM Tweets GROUP BY UserId) AS T
        ON T.UserId = U.id

        LEFT JOIN (
        SELECT T.UserId, SUM(L.likeCount) AS likedCount
        FROM Tweets AS T
        LEFT JOIN (SELECT TweetId, COUNT(TweetId) AS likeCount FROM Likes GROUP BY TweetId) AS L
        ON T.id = L.TweetId
        GROUP BY T.UserId) AS L
        ON L.UserId = U.id;`,
        { type: QueryTypes.SELECT })
      res.json(users)
    } catch (err) {
      console.log(err)
      return res.status(500).json({ status: 'error', message: '內部伺服器錯誤' })
    }
  },
  getTopUsers: async (req, res, next) => {
    try {
      let topUsers = await sequelize.query(`
        SELECT F.followingId, name,account,avatar, IF(isFollowed.followingId, true, false) AS isFollowed
        FROM Users AS U
        INNER JOIN (SELECT followingId, COUNT(followingId) AS followerCount FROM Followships WHERE followingId <> ${req.user.id} GROUP BY followingId LIMIT 10) AS F
        ON U.id = F.followingId
        LEFT JOIN (SELECT followingId FROM Followships WHERE followerId = ${req.user.id} ) AS isFollowed
        ON U.id = isFollowed.followingId
        ORDER BY F.followingId;`,
        { type: QueryTypes.SELECT })
      res.json(topUsers)
    } catch (err) {
      console.log(err)
      return res.status(500).json({ status: 'error', message: '內部伺服器錯誤' })
    }
  },
  getUser: async (req, res, next) => {
    try {
      const user = await sequelize.query(`
        SELECT U.id,account,name,email,avatar,cover,introduction,role, IFNULL(a.followerCount,0) AS followerCount, IFNULL(b.followingCount,0) AS followingCount, IF(c.isFollowed, true, false) AS isFollowed
        FROM Users AS U

        LEFT JOIN (
        SELECT followingId, COUNT(followingId) AS followerCount
        FROM Followships
        WHERE followingId = ${req.params.id}
        GROUP BY followingId) AS a
        ON a.followingId = U.id

        LEFT JOIN (
        SELECT followerId, COUNT(followerId) AS followingCount
        FROM Followships
        WHERE followerId = ${req.params.id}
        GROUP BY followerId) AS b
        ON b.followerId = U.id

        LEFT JOIN(
        SELECT followingId AS isFollowed
        FROM Followships
        WHERE followerId = ${helpers.getUser(req).id}
        ) AS c
        ON c.isFollowed = U.id

        WHERE U.id = ${req.params.id};`,
        { plain: true, type: QueryTypes.SELECT })

      if (!user) {
        return res.json({ status: 'error', message: '使用者不存在' })
      }
      if (user.role === 'admin') {
        return res.status(401).json({ status: 'error', message: 'Unauthorized' })
      }
      delete user.role //not required on frontend
      if (helpers.getUser(req).id === Number(req.params.id)) {
        user.isCurrentUser = true
      }
      res.json(user)
    } catch (err) {
      console.log(err)
      return res.status(500).json({ status: 'error', message: '內部伺服器錯誤' })
    }
  },
  getTweets: async (req, res, next) => {
    try {
      let tweets = await sequelize.query(`
        SELECT T.*, IFNULL(L.likedCount, 0) AS likedCount, IFNULL(R.repliedCount, 0) AS repliedCount
        FROM Tweets AS T
        LEFT JOIN (SELECT TweetId, COUNT(TweetId) AS likedCount FROM Likes GROUP BY TweetId) AS L
        ON L.TweetId = T.id
        LEFT JOIN (SELECT TweetId, COUNT(TweetId) AS repliedCount FROM Replies GROUP BY TweetId) AS R
        ON R.TweetId = T.id
        WHERE T.UserId = ${req.params.id}`
        , { type: QueryTypes.SELECT })
      let user = await sequelize.query(`
        SELECT id,name,account,avatar FROM Users WHERE id=${req.params.id};`,
        { plain: true, type: QueryTypes.SELECT }
      )
      tweets = tweets.map(t => ({
        user,
        ...t
      }))
      res.json(tweets)
    } catch (err) {
      console.log(err)
      return res.status(500).json({ status: 'error', message: '內部伺服器錯誤' })
    }
  }
}