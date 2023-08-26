const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User, Tweet, Like, Reply } = require('../models')
const helpers = require('../_helpers')

const userController = {
  signUp: (req, res, next) => {
    const { name, account, email, password, checkPassword } = req.body
    if (!name || !account || !email || !password || !checkPassword) throw new Error('所有欄位皆為必填！')
    if (name.length > 50) throw new Error('暱稱字數超出上限！')
    if (password !== checkPassword) throw new Error('密碼與確認密碼不符合！')
    return Promise.all([
      User.findOne({ where: { email } }),
      User.findOne({ where: { account } })
    ])
      .then(([userA, userB]) => {
        if (userA) throw new Error('email已重複註冊！')
        if (userB) throw new Error('account已重複註冊！')
        return bcrypt.hash(password, 10)
      })
      .then(hash => User.create({
        name,
        account,
        email,
        password: hash
      }))
      .then(userData => {
        userData = userData.toJSON()
        delete userData.password
        return res.json({
          status: 'success',
          data: { user: userData }
        })
      })
      .catch(err => next(err))
  },
  signIn: (req, res, next) => {
    const userData = helpers.getUser(req).toJSON()
    const JWTSecret = process.env.JWT_SECRET || 'SECRET'
    delete userData.password
    if (userData.role === 'admin') {
      const err = new Error('帳號不存在！')
      err.status = 404
      throw err
    }
    try {
      const token = jwt.sign(userData, JWTSecret, { expiresIn: '30d' })
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

  getUser: (req, res, next) => {
    const UserId = req.params.id
    const isFollowed = helpers.getUser(req).Followings.some(f => f.id.toString() === UserId)

    return User.findByPk(UserId, {
      attributes: { exclude: ['password'] },
      include: [
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
      .then(user => {
        if (!user) {
          const err = new Error('使用者不存在！')
          err.status = 404
          throw err
        }

        const result = {
          ...user.toJSON(),
          followersCount: user.Followers.length,
          followingsCount: user.Followings.length,
          isFollowed
        }
        delete result.Followers
        delete result.Followings
        return res.json(result)
      })
      .catch(err => next(err))
  },

  getUserTweets: (req, res, next) => {
    const UserId = req.params.id
    const likedTweetsId = helpers.getUser(req)?.Likes ? helpers.getUser(req).Likes.map(l => l.TweetId) : []

    return Promise.all([
      User.findByPk(UserId),
      Tweet.findAll({
        where: { UserId },
        include: [
          { model: User, attributes: { exclude: ['password'] } },
          Like,
          Reply
        ],
        order: [['createdAt', 'DESC']]
      })
    ])
      .then(([user, tweets]) => {
        if (!user) {
          const err = new Error('使用者不存在！')
          err.status = 404
          throw err
        }

        const result = tweets.map(tweet => ({
          ...tweet.toJSON(),
          likesCount: tweet.Likes.length,
          repliesCount: tweet.Replies.length,
          isLiked: likedTweetsId.includes(tweet.id)
        }))
        result.forEach(item => {
          delete item.Likes
          delete item.Replies
        })
        return res.json(result)
      })
      .catch(err => next(err))
  },

  getUserReplies: (req, res, next) => {
    const UserId = req.params.id

    return Promise.all([
      User.findByPk(UserId),
      Reply.findAll({
        where: { UserId },
        include: [
          { model: Tweet, include: [{ model: User, attributes: { exclude: ['password'] } }] }
        ],
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })
    ])
      .then(([user, replies]) => {
        if (!user) {
          const err = new Error('使用者不存在！')
          err.status = 404
          throw err
        }

        res.json(replies)
      })
      .catch(err => next(err))
  },

  getUserLikes: (req, res, next) => {
    const UserId = req.params.id
    const likedTweetsId = helpers.getUser(req)?.Likes ? helpers.getUser(req).Likes.map(l => l.TweetId) : []

    return Promise.all([
      User.findByPk(UserId),
      Like.findAll({
        where: { UserId },
        include: [{
          model: Tweet,
          include: [
            { model: User, attributes: { exclude: ['password'] } },
            Like,
            Reply
          ]
        }],
        order: [['createdAt', 'DESC']]
      })
    ])
      .then(([User, likes]) => {
        if (!User) {
          const err = new Error('使用者不存在！')
          err.status = 404
          throw err
        }

        const result = likes.map(like => {
          like = like.toJSON()
          like.Tweet.likesCount = like.Tweet.Likes.length
          like.Tweet.repliesCount = like.Tweet.Replies.length
          delete like.Tweet.Likes
          delete like.Tweet.Replies
          like.Tweet.isLiked = likedTweetsId.includes(like.TweetId)
          return like
        })

        res.json(result)
      })
      .catch(err => next(err))
  }
}

module.exports = userController
