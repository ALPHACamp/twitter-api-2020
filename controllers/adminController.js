const { User, Tweet, Like } = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const moment = require('moment')
const Sequelize = require('sequelize')

const adminController = {
  signIn: async (req, res, next) => {
    try {
      const { email, password } = req.body
      // 檢查必填資料
      if (!email || !password) {
        return res.json({ status: 'error', message: 'Email跟密碼皆為必填！' })
      }
      // 檢查 user 是否存在和密碼是否正確
      const user = await User.findOne({ where: { email } })
      if (!user) {
        return res.json({ status: 'error', message: '找不到此Email。' })
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return res.json({ status: 'error', message: '帳號或密碼不正確！' })
      }
      // 檢查是否為非管理者
      if (user.role !== 'admin') {
        return res.json({ status: 'error', message: '非管理者無法登入後台！' })
      }
      // 簽發 token
      const payload = { id: user.id }
      const token = jwt.sign(payload, 'SimpleTwitterSecret')
      return res.json({
        status: 'success',
        message: '登入成功！',
        token: token,
        user: {
          // 這包user回傳資料可依前端需求增減
          id: user.id,
          account: user.account,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar
        }
      })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  getUsers: async (req, res, next) => {
    try {
      // 資料按推文數排列，只顯示 role = normal 的 user 資料
      // 要包括關注人數、跟隨者人數、推文 (tweet) 數量、推文被 like 的數量
      const users = await User.findAll({
        raw: true,
        nest: true,
        where: {
          role: 'normal'
        },
        attributes: [
          'id', 'name', 'account', 'avatar',
          'cover', 'followingCounts', 'followerCounts',
          [
            Sequelize.literal(`(
              SELECT COUNT(Tweets.id)
              FROM Tweets
              WHERE Tweets.UserId = User.id
            )`),
            'TweetCounts'
          ],
          [
            Sequelize.literal(`(
              SELECT SUM(Tweets.likeCounts)
              FROM Tweets
              WHERE Tweets.UserId = User.id
            )`),
            'BeLikedCounts'
          ]
        ],
        group: ['User.id'],
        order: [[Sequelize.literal('TweetCounts'), 'DESC']]
      })
      return res.json(users)
    } catch (err) {
      // 把失誤 pass 給 express，並將失誤訊息 pass 給前端
      next(err)
      return res.json({ status: 'error', message: err.toString() })
    }
  },
  getTweets: async (req, res, next) => {
    try {
      // 資料按發文日期 desc 排列
      const result = await Tweet.findAll({
        raw: true,
        nest: true,
        attributes: ['id', 'description', 'createdAt'],
        order: [
          ['createdAt', 'DESC']
        ],
        include: [{
          model: User,
          attributes: ['id', 'name', 'account', 'avatar'],
        }]
      })
      // 將取得資料做整理
      const tweets = result.map(tweet => ({
        ...tweet,
        description: tweet.description.substring(0, 50),
        createdAt: moment(tweet.createdAt).format('YYYY-MM-DD hh:mm:ss a')
      }))
      return res.json(tweets)
    } catch (err) {
      next(err)
      return res.json({ status: 'error', message: err.toString() })
    }
  },
  deleteTweet: async (req, res, next) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id)
      tweet.destroy()
      return res.json({ status: 'success', message: '成功刪除推文！' })
    } catch (err) {
      next(err)
      return res.json({ status: 'error', message: err.toString() })
    }
  }
}

module.exports = adminController