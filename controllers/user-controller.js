const { User, Tweet, Reply, Like } = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const helpers = require('../_helpers')
const { newErrorGenerate } = require('../helpers/newError-helper')
const { isUser } = require('../helpers/isUser-helper')
const { relativeTimeFromNow } = require('../helpers/dayFix-helper')
const USERS_WORD_LIMIT = 50

const userController = {
  // 使用者註冊
  signup: async (req, res, next) => {
    try {
      const { name, account, email, password, checkPassword } = req.body
      if (!name || !account || !email || !password || !checkPassword) newErrorGenerate('所有欄位皆為必填!', 404)
      if (name.length > USERS_WORD_LIMIT) newErrorGenerate('暱稱字數超出上限!', 404)
      if (password !== checkPassword) newErrorGenerate('密碼及確認密碼不相符!', 404)
      const userAccount = await User.findOne({ where: { account } })
      const userEmail = await User.findOne({ where: { email } })
      if (userAccount) newErrorGenerate('account 已重複註冊！', 404)
      if (userEmail) newErrorGenerate('email 已重複註冊！', 404)
      const hash = await bcrypt.hash(password, 10)
      let user = await User.create({
        name,
        account,
        email,
        password: hash,
        role: 'user'
      })
      user = user.toJSON()
      delete user.password
      return res.json({ status: 'success', data: { user } })
    } catch (err) {
      next(err)
    }
  },
  // 前台登入
  signIn: (req, res, next) => {
    try {
      const userData = helpers.getUser(req).toJSON()
      if (userData.role === 'admin') newErrorGenerate('帳號不存在！', 404)
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' }) // 簽發 JWT，效期為 30 天
      return res.json({
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
  // 查看使用者資料
  getUser: async (req, res, next) => {
    try {
      const userId = req.params.id
      const user = await User.findByPk(userId, {
        nest: true,
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      })
      const tweets = await Tweet.findAll({
        where: { UserId: userId },
        raw: true
      })
      if (!user) newErrorGenerate('使用者不存在', 404)
      let userData = user.toJSON()
      const followersCount = user.Followers.length
      const followingsCount = user.Followings.length
      delete userData.Followers
      delete userData.Followings
      userData.isSignInUser = isUser(req)
      userData.tweetsCount = tweets.length
      userData = {
        ...userData,
        followersCount,
        followingsCount
      }
      return res.json(userData)
    } catch (err) {
      next(err)
    }
  },
  // 獲取使用者所寫過的推文資料
  getUserTweets: async (req, res, next) => {
    try {
      const userId = req.params.id
      const user = await User.findByPk(userId, { raw: true, attributes: ['name', 'account', 'avatar'] })
      if (!user) newErrorGenerate('使用者不存在', 404)
      const tweets = await Tweet.findAll({
        where: { UserId: userId },
        order: [['createdAt', 'DESC']],
        include: [
          { model: Reply, include: User },
          { model: Like, include: User }
        ]
      })
      const tweetsData = tweets?.map(tweet => {
        tweet = tweet.toJSON()
        const { Replies, Likes, ...tweetData } = tweet
        return {
          ...tweetData,
          relativeTimeFromNow: relativeTimeFromNow(tweet.createdAt),
          repliesCount: tweet.Replies?.length,
          likesCount: tweet.Likes?.length
        }
      })
      tweetsData.push(user)
      return res.json(tweetsData)
    } catch (err) {
      next(err)
    }
  },
  // 獲取使用者所寫過的推文回覆資料
  getUserReplies: async (req, res, next) => {
    try {
      const userId = req.params.id
      const user = await User.findByPk(userId, { raw: true, attributes: ['name', 'account', 'avatar'] })
      if (!user) newErrorGenerate('使用者不存在', 404)
      const replies = await Reply.findAll({
        where: { UserId: userId },
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: Tweet,
            attributes: ['id'],
            include: {
              model: User,
              attributes: ['account']
            }
          }
        ],
        raw: true,
        nest: true
      })
      const repliesData = replies?.map(reply => ({
        ...reply,
        relativeTimeFromNow: relativeTimeFromNow(reply.createdAt)
      }))
      repliesData.push(user)
      return res.json(repliesData)
    } catch (err) {
      next(err)
    }
  },
  // 獲取使用者的like資料
  getUserLikes: async (req, res, next) => {
    try {
      const userId = req.params.id
      const user = await User.findByPk(userId, { raw: true, attributes: ['id'] })
      if (!user) newErrorGenerate('使用者不存在', 404)
      const likes = await Like.findAll({
        where: { UserId: userId },
        order: [['createdAt', 'DESC'], ['Tweet', 'createdAt', 'DESC']],
        include: {
          model: Tweet,
          distinct: true,
          include: [
            { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
            { model: Like, attributes: ['id'] },
            { model: Reply, attributes: ['id'] }
          ]
        }
      })
      const likesData = likes?.map(like => {
        like = like?.toJSON()
        like.User = like?.Tweet.User
        like.likesCount = like?.Tweet?.Likes?.length
        like.repliesCount = like?.Tweet?.Replies?.length
        like.Tweet.relativeTimeFromNow = relativeTimeFromNow(like?.Tweet?.createdAt)
        const { User, Likes, Replies, ...cleanLike } = like?.Tweet
        like.Tweet = cleanLike
        return like
      })
      return res.json(likesData)
    } catch (err) {
      next(err)
    }
  }
}
module.exports = userController
