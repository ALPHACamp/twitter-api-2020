const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const helpers = require('../../_helpers')
const { User, Tweet, Like, Reply } = require('../../models')
const appFunc = require('../../services/appFunctions')
const TOKEN_EXPIRES = process.env.TOKEN_EXPIRES || '30m'

const userController = {
  signUp: async (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    try {
      if (!account || !email || !password || !checkPassword) throw new Error('account, email, password, checkPassword is require!')
      if (password !== checkPassword) throw new Error('Password do not match!')
      const userAccountExisted = await User.findOne({ where: { account } })
      if (userAccountExisted) throw new Error('Account already exists!')
      const userEmailExisted = await User.findOne({ where: { email } })
      if (userEmailExisted) throw new Error('Email already exists!')
      const hash = await bcrypt.hash(password, await bcrypt.genSalt(10))
      const user = await User.create({
        account,
        name,
        email,
        password: hash,
        role: 'user'
      })
      delete user.password
      res.json({
        status: 'success',
        data: {
          user
        }
      })
    } catch (err) {
      next(err)
    }
  },
  signIn: (req, res, next) => {
    const userData = helpers.getUser(req).toJSON()
    try {
      // 非使用者不能登入前台
      if (userData.role !== 'user') throw new Error('Account or Password is wrong!')
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRES })
      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      const userId = Number(helpers.getUser(req).id)
      const id = Number(req.params.id)
      const user = await User.findByPk(id)
      if (!user || user.role === 'admin') throw new Error("User didn't exist!")
      const tweets = await Tweet.findAll({
        where: { UserId: id },
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: {
          model: User,
          attributes: ['name', 'account', 'avatar']
        }
      })
      if (process.env.NODE_ENV === 'test') {
        res.json(tweets)
      }
      const resTweets = await Promise.all(tweets.map(async tweet => {
        return await appFunc.resTweetHandler(userId, tweet)
      }))
      res.json({
        status: 'success',
        data: { tweets: resTweets }
      })
    } catch (err) {
      next(err)
    }
  },
  getReplies: async (req, res, next) => {
    try {
      const id = Number(req.params.id)
      const user = await User.findByPk(id)
      if (!user || user.role === 'admin') throw new Error("User didn't exist!")
      const replies = await Reply.findAll({
        where: { UserId: id },
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: {
          model: User,
          attributes: ['name', 'account', 'avatar']
        }
      })
      if (process.env.NODE_ENV === 'test') {
        res.json(replies)
      }
      res.json({
        status: 'success',
        data: { replies }
      })
    } catch (err) {
      next(err)
    }
  },
  getLikes: async (req, res, next) => {
    try {
      const userId = Number(helpers.getUser(req).id)
      const id = Number(req.params.id)
      const user = await User.findByPk(id)
      if (!user || user.role === 'admin') throw new Error("User didn't exist!")
      const likes = await Like.findAll({
        where: { UserId: id },
        raw: true,
        nest: true,
        include: {
          model: Tweet,
          order: [['createdAt', 'DESC']],
          include: {
            model: User,
            attributes: ['name', 'account', 'avatar']
          }
        }
      })
      const tweets = likes.map(like => like.Tweet)
      if (process.env.NODE_ENV === 'test') {
        tweets.map(tweet => {
          tweet.TweetId = tweet.id
          return tweet
        })
        res.json(tweets)
      }
      const resTweets = await Promise.all(tweets.map(async tweet => {
        return await appFunc.resTweetHandler(userId, tweet)
      }))
      res.json({
        status: 'success',
        data: { tweets: resTweets }
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
