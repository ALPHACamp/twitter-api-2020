const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Like = db.Like
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { sequelize } = require('../models')

const adminController = {
  // 登入
  login: async (req, res) => {
    try {
      const { account, password } = req.body
      // check account & password required
      if (!account || !password) {
        return res.json({ status: 'error', message: 'account and password are required!' })
      }
      // check account exists or not
      const user = await User.findOne({ where: { account } })
      if (!user) {
        return res.status(401).json({ status: 'error', message: 'this account has not been registered!' })
      }
      // check user role, must be admin
      if (user.role !== 'admin') {
        return res.status(401).json({ status: 'error', message: 'you don\'t have authority to login!' })
      }
      // check password correct or not
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: 'password incorrect!' })
      }
      // get token
      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.json({
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
    }
  },
  // 取得所有使用者資料 (清單預設按推文數排序)
  // account、name、avatar、cover、推文數量、推文被 like 的數量、關注人數、跟隨者人數
  getUsers: async (req, res) => {
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
      return res.json(users)
    } catch (e) {
      console.log(e)
    }
  },
  // 刪除使用者的推文
  deleteTweet: async (req, res) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id)
      if (!tweet) return res.json({ status: 'error', message: 'this tweet doesn\'t exist!' })
      await tweet.destroy()
      return res.json({ status: 'success', message: 'this tweet has been deleted!' })
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = adminController
