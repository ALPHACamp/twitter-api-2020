const { User, Tweet, Reply, Like } = require('../models')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const adminController = {
  signIn: async (req, res, next) => {
    try {
      const { account, password } = req.body
      console.log(account, password)
      const user = await User.findOne({ where: { account } })
      if (!account || !password) {
        return res.status(400).json({
          status: 'error',
          message: '所有欄位都要填寫'
        })
      }
      if (user.role !== 'admin') {
        return res.status(403).json({
          status: 'error',
          message: '帳號不存在'
        })
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(403).json({
          status: 'error',
          message: '帳號或密碼錯誤'
        })
      }
      const userData = user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.json({
        status: 'success',
        data: {
          token,
          admin: userData
        },
        message: 'Admin 登入成功！'
      })
    } catch (err) {
      next(err)
    }
  },
  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        where: { role: 'user' },
        order: [['tweetCount', 'DESC']],
        attributes: { exclude: ['password'] },
        raw: true
      })
      if (!users.length) throw new Error('沒有任何使用者!')

      return res.status(200).json(users)
    } catch (err) { next(err) }
  },
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        nest: true,
        include: [{
          model: User,
          attributes: ['name', 'account', 'avatar']
        }],
        order: [['createdAt', 'DESC']],
        raw: true
      })
      const tweetsSubstr = tweets.map(tweet => ({
        ...tweet,
        description: tweet.description.substring(0, 50)
      }))

      return res.json({
        status: 'success',
        tweets: tweetsSubstr
      })
    } catch (err) {
      next(err)
    }
  },
  deleteTweet: async (req, res, next) => {
    try {
      const TweetId = req.params.id
      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) throw new Error('推文不存在！')

      const user = await User.findByPk(tweet.UserId)
      if (!user) throw new Error('使用者不存在，刪除推文動作失敗！')

      await Reply.destroy({ where: { TweetId } })
      await Like.destroy({ where: { TweetId } })
      await user.decrement('tweetCount', { by: 1 })
      await user.decrement('likeCount', { by: tweet.likeCount })

      return res.json({
        status: 'success',
        data: await tweet.destroy(),
        message: '成功刪除推文'
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController
