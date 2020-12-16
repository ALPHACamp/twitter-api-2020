const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User, Tweet, Like, sequelize, Sequelize } = require('../models/index')
const QueryTypes = Sequelize.QueryTypes
const { isEmailValid } = require('../utils/helpers')

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
      //first promise get the users of having the highest follower count and exclude the current user since one cannot follow oneself
      //second promise get the current user's followings
      let [topUsers, followings] = await Promise.all([
        sequelize.query(`
        SELECT F.followingId, name,account,avatar
        FROM Users AS U
        INNER JOIN (SELECT followingId, COUNT(followingId) AS followerCount FROM Followships WHERE followingId <> ${req.user.id} GROUP BY followingId LIMIT 10) AS F
        ON U.id = F.followingId;`,
          { type: QueryTypes.SELECT }),
        sequelize.query(`
        SELECT followingId
        FROM Followships
        WHERE followerId = ${req.user.id};`,
          { type: QueryTypes.SELECT })
      ])
      const followingIds = followings.map(f => f.followingId)
      topUsers = topUsers.map(u => ({
        ...u,
        isFollowed: followingIds.includes(u.followingId) //indicating if the current user has already followed the user from the top user list
      }))
      res.json(topUsers)
    } catch (err) {
      console.log(err)
      return res.status(500).json({ status: 'error', message: '內部伺服器錯誤' })
    }
  },
}