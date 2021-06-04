const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Like = db.Like
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { sequelize } = require('../models')

const adminController = {
  // 登入
  login: async (req, res, next) => {
    try {
      const { account, password } = req.body
      // 確認 account & password必填
      if (!account || !password) {
        return res.status(400).json({ status: 'error', message: 'account and password are required!' })
      }
      // 確認 account 是否已存在資料庫
      const user = await User.findOne({ where: { account } })
      if (!user) {
        return res.status(401).json({ status: 'error', message: 'this account has not been registered!' })
      }
      // 確認使用者的 role, 必須是 'admin'
      if (user.role !== 'admin') {
        return res.status(403).json({ status: 'error', message: 'you don\'t have authority to login!' })
      }
      // 確認 password 是否正確
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: 'password incorrect!' })
      }
      // 回傳使用者資訊和 token
      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.status(200).json({
        status: 'success',
        message: 'ok',
        token: token,
        user: {
          id: user.id,
          account: user.account,
          email: user.email,
          name: user.name,
          role: user.role
        }
      })
    } catch (e) {
      console.log(e)
      return next(e)
    }
  },
  // 取得所有使用者資料 (清單預設按推文數排序)
  // account、name、avatar、cover、推文數量、推文被 like 的數量、關注人數、跟隨者人數
  getUsers: async (req, res, next) => {
    try {
      // 找出所有 user
      let users = await User.findAll({
        where: { role: 'user' },
        include: [
          { model: Tweet, include: [Like] },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ],
        attributes: {
          include: [
            [
              sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE Tweets.UserId = User.id)'), 'tweetcount'
            ]
          ]
        },
        order: [[sequelize.literal('tweetcount'), 'DESC']]
      })
      // 如果沒有 user，回傳 message
      if (!users.length) {
        return res.status(200).json({ message: 'db has no user!' })
      }
      // 回傳資料
      users = users.map(user => {
        // 計算 : 推文被 like 的數量
        let tweetsLikedCount = 0
        user.Tweets.forEach(tweet => {
          tweetsLikedCount += tweet.Likes.length
        })
        return {
          id: user.id,
          account: user.account,
          name: user.name,
          avatar: user.avatar,
          cover: user.cover,
          tweetCount: user.Tweets.length,
          tweetsLikedCount: tweetsLikedCount,
          followingsCount: user.Followings.length,
          followersCount: user.Followers.length
        }
      })
      return res.status(200).json(users)
    } catch (e) {
      console.log(e)
      return next(e)
    }
  },
  // 刪除使用者的推文
  deleteTweet: async (req, res, next) => {
    try {
      const id = req.params.id
      const tweet = await Tweet.findByPk(id)
      if (!tweet) { return res.status(401).json({ status: 'error', message: 'this tweet doesn\'t exist!' }) }
      await tweet.destroy()
      // 刪除相關資料
      // Promise.all([
      //   tweet.destroy(),
      //   Like.destroy({ where: { TweetId: id } }),
      //   Reply.destroy({ where: { TweetId: id } })
      // ])
      return res.status(200).json({ status: 'success', message: 'this tweet has been deleted!' })
    } catch (e) {
      console.log(e)
      return next(e)
    }
  }
}

module.exports = adminController
