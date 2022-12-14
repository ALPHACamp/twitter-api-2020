const { User, Tweet, Reply, Like, Followship } = require('../models')
const helpers = require('../_helpers')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
require('dayjs/locale/zh-tw')
dayjs.locale('zh-tw')
dayjs.extend(relativeTime)

const userController = {
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' }) // 簽發 JWT，效期為 30 天
      res.json({
        status: 'success',
        token,
        user: userData
      })
    } catch (err) {
      next(err)
    }
  },
  signUp: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    if (!account || !name || !email || !password || !checkPassword) throw new Error('所有欄位皆為必填')
    if (password !== checkPassword) throw new Error('密碼與確認密碼不相符！')
    return Promise.all([
      User.findOne({ where: { account }, raw: true }),
      User.findOne({ where: { email }, raw: true })
    ])
      .then(([userFoundByAccount, userFoundByEmail]) => {
        if (userFoundByAccount) throw new Error('account 已重複註冊！')
        if (userFoundByEmail) throw new Error('email 已重複註冊！')
        return bcrypt.hash(password, 10)
      })
      .then(hash => {
        return User.create({
          account,
          name,
          email,
          password: hash
        })
      })
      .then(newUser => {
        const userData = newUser.toJSON()
        delete userData.password
        res.json({ status: 'success', message: '帳號已成功註冊', newUser: userData })
      })
      .catch(err => next(err))
  },
  // CurrentUser Profile：[未完成] tweetCount, followerCount, followingCount
  getCurrentUser: (req, res, next) => {
    return User.findByPk(helpers.getUser(req).id, {
      // include: [
      //   { model: Tweet },
      //   { model: User, as: 'Followers' },
      //   { model: User, as: 'Followings' }
      // ]
    })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        return res.json(user)
      })
      .catch(err => next(err))
  },
  getUser: (req, res, next) => {
    return User.findByPk(req.params.id, {
      // include: [
      //   { model: Tweet },
      //   { model: User, as: 'Followers' },
      //   { model: User, as: 'Followings' }
      // ]
    })
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        return res.json(user)
      })
      .catch(err => next(err))
  },
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      where: { UserId: req.params.id },
      include: User
    })
      .then(tweets => {
        return tweets
          .map(tweet => ({
            ...tweet.dataValues,
            relativeTime: dayjs(tweet.dataValues.createdAt).fromNow()
          }))
      })
      .then(tweets => {
        if (!tweets) throw new Error("Tweet didn't exist!")
        return res.json(tweets)
      })
      .catch(err => next(err))
  },
  getRepliedTweets: (req, res, next) => {
    return Reply.findAll({
      where: { UserId: req.params.id },
      include: [User, Tweet]
    })
      .then(replies => {
        return replies
          .map(reply => ({
            ...reply.dataValues,
            relativeTime: dayjs(reply.dataValues.createdAt).fromNow()
          }))
      })
      .then(replies => {
        if (!replies) throw new Error("Reply didn't exist!")
        return res.json(replies)
      })
      .catch(err => next(err))
  },
  addFollowing: (req, res, next) => {
    const followingId = Number(req.body.id)
    if (helpers.getUser(req).id === followingId) throw new Error('不能追蹤自己！')
    return Promise.all([
      User.findByPk(followingId),
      Followship.findOne({
        where: {
          followerId: helpers.getUser(req).id,
          followingId: followingId
        }
      })
    ])
      .then(([user, followship]) => {
        if (!user || user?.role === 'admin') throw new Error("User didn't exist!")
        if (followship) throw new Error('You are already following this user!')
        return Followship.create({
          followerId: helpers.getUser(req).id,
          followingId: followingId
        })
      })
      .then(newFollowship => res.json(newFollowship))
      .catch(err => next(err))
  },
  removeFollowing: (req, res, next) => {
    Followship.findOne({
      where: {
        followerId: helpers.getUser(req).id,
        followingId: req.params.followingId
      }
    })
      .then(followship => {
        if (!followship) throw new Error("You haven't followed this user!")
        return followship.destroy()
      })
      .then(deleteFollowship => res.json(deleteFollowship))
      .catch(err => next(err))
  }
}

module.exports = userController
