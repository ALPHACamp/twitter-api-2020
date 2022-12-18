const { User, Tweet, Reply, Followship, sequelize } = require('../models')
const helpers = require('../_helpers')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { dateFormat } = require('../helpers/date-helper')

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
    if (password !== checkPassword) throw new Error('密碼與確認密碼不相符!')
    if (name?.length > 50) throw new Error('暱稱 name 上限 50 字!')
    return Promise.all([
      User.findOne({ where: { account }, raw: true }),
      User.findOne({ where: { email }, raw: true })
    ])
      .then(([userFoundByAccount, userFoundByEmail]) => {
        if (userFoundByAccount) throw new Error('account 已重複註冊!')
        if (userFoundByEmail) throw new Error('email 已重複註冊!')
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
        res.json({ status: 'success', message: '帳號已成功註冊!', newUser: userData })
      })
      .catch(err => next(err))
  },
  getCurrentUser: (req, res, next) => {
    const currentUser = helpers.getUser(req)
    return User.findByPk(currentUser.id, {
      attributes: {
        exclude: ['password'],
        include: [
          [sequelize.literal('(SELECT COUNT(*) FROM tweets WHERE tweets.UserId = user.id )'), 'tweetCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM followships WHERE followships.followingId = user.id )'), 'followerCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM followships WHERE followships.followerId = user.id )'), 'followingCount']
        ]
      }
    })
      .then(user => {
        if (!user) throw new Error('使用者不存在!')
        return res.json(user)
      })
      .catch(err => next(err))
  },
  getUser: (req, res, next) => {
    const currentUser = helpers.getUser(req)
    return User.findByPk(req.params.id, {
      attributes: {
        exclude: ['password'],
        include: [
          [sequelize.literal('(SELECT COUNT(*) FROM tweets WHERE tweets.UserId = user.id )'), 'tweetCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM followships WHERE followships.followingId = user.id )'), 'followerCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM followships WHERE followships.followerId = user.id )'), 'followingCount'],
          [sequelize.literal(`EXISTS (SELECT id FROM followships WHERE followships.followerId = ${currentUser.id} AND followships.followingId = user.id )`), 'isFollowing']
        ]
      }
    })
      .then(user => {
        if (!user) throw new Error('使用者不存在!')
        return res.json(user)
      })
      .catch(err => next(err))
  },
  getUserTweets: (req, res, next) => {
    const currentUser = helpers.getUser(req)
    return Tweet.findAll({
      where: { UserId: req.params.id },
      include: [
        {
          model: User,
          attributes: {
            exclude: ['password']
          }
        }],
      attributes: {
        include: [
          [sequelize.literal('(SELECT COUNT(*) FROM replies WHERE replies.TweetId = tweet.id )'), 'replyCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM likes WHERE likes.TweetId = tweet.id )'), 'likeCount'],
          [sequelize.literal(`EXISTS (SELECT id FROM likes WHERE likes.UserId = ${currentUser.id} AND likes.TweetId = tweet.id )`), 'isLiked']
        ]
      },
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true
    })
      .then(tweets => {
        return tweets
          .map(tweet => ({
            ...tweet,
            relativeTime: dateFormat(tweet.createdAt).fromNow()
          }))
      })
      .then(tweets => {
        if (!tweets) throw new Error("Tweet didn't exist!")
        return res.json(tweets)
      })
      .catch(err => next(err))
  },
  getUserReplies: (req, res, next) => {
    return Reply.findAll({
      where: { UserId: req.params.id },
      include: [
        {
          model: User,
          attributes: {
            exclude: ['password', 'email', 'cover', 'introduction', 'role', 'createdAt', 'updatedAt']
          }
        },
        {
          model: Tweet,
          attributes: ['UserId'],
          include: {
            model: User,
            attributes: ['name']
          }
        }
      ]
    })
      .then(replies => {
        return replies
          .map(reply => ({
            ...reply.dataValues,
            relativeTime: dateFormat(reply.dataValues.createdAt).fromNow()
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
    if (helpers.getUser(req).id === followingId) throw new Error('不能追蹤自己!')
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
