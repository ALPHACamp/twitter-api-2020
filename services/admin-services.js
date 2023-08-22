const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User, Tweet, Reply, Like, Followship } = require('../models')

const adminServices = {
  signIn: async (req, cb) => {
    try {
      const { email, password } = req.body
      if (!email || !password) {
        const err = new Error('請輸入帳號密碼')
        err.status = 403
        throw err
      }
      const user = await User.findOne({ where: { email } })
      if (!email) {
        const err = new Error('帳號密碼輸入錯誤')
        err.status = 403
        throw err
      }
      if (user.role === 'user') {
        const err = new Error('帳號不存在')
        err.status = 403
        throw err
      }
      if (!bcrypt.compareSync(password, user.password)) {
        const err = new Error('帳號密碼輸入錯誤')
        err.status = 403
        throw err
      }
      const userData = user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      return cb(null, {
        token,
        user: userData
      })
    } catch (err) {
      cb(err)
    }
  },
  getUsers: async(req, cb) => {
    try{
      const users = await User.findAll({
        include:[
          Tweet,
          { model: Reply, include: Tweet },
          { model: Tweet, as: 'LikeTweets' },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ],
      })
      const userData = users
        .map(user => ({
          ...user.toJSON(),
          Tweets: user.Tweets.length,
          Replies: user.Replies.length,
          LikeTweets: user.LikeTweets.length,
          Followers: user.Followers.length,
          Followings: user.Followings.length
        }))
        .sort((a, b) => b.Followers - a.Followers)
      cb(null, userData)
    }catch(err){
      cb(err)
    }
  },
  getAdminTweets: async (req, cb) => {
    try {
      const tweets = await Tweet.findAll({
        include: [
          User,
          Reply,
          { model: User, as: 'LikeUsers' }
        ],
        raw: true,
        nest: true
      })
      cb(null, { tweets })
    } catch (err) {
      cb(err)
    }
  }
}

module.exports = adminServices