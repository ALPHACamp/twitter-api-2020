if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const userDummy = require('./dummy/users-dummy.json')
const { User, Tweet, Reply, Like } = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const helpers = require('../_helpers')

const userController = {
  getUsers: (req, res, next) => {
    return User.findAll({
      raw: true,
      nest: true
    })
      .then(users => { res.json(users) })
  },
  getUser: (req, res, next) => {
    helpers.getUser(req)
    return User.findByPk(req.params.id)
      .then(user => {
        if (!user) throw new Error('getUser查無此人')
        // res.json({ status: 'success', user: user.toJSON() })
        res.status(200).json(user.toJSON())
      })
  },
  getTopUsers: (req, res, next) => {
    console.log('users_getTopUser')
    res.json(userDummy.getTopUsers)
  },
  signUp: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    if (password !== checkPassword) throw new Error('Password do not match!')
    return User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => {
        return User.create({
          account,
          name,
          email,
          password: hash,
          avatar: 'https://i.imgur.com/V4RclNb.png',
          banner: 'https://i.imgur.com/ZFz8ZEI.png',
          role: 'user'
        })
      })
      .then(signUpUser => {
        delete signUpUser.password
        res.json({ status: 'success', signUpUser })
      })
      .catch(err => next(err))
  },
  signIn: async (req, res, next) => {
    try {
      const userData = helpers.getUser(req).toJSON()
      delete userData.password
      // JWT (A, B, C)
      // A: payload, 要打包的資訊; B: 密鑰, 使用.env來寫; C: 設定, 這邊設定有效天數
      // process.env.JWT_SECRET
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
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
  // userRequest #3
  getUserTweets: async (req, res, next) => {
    const userId = Number(req.params.id)
    Promise.all([
      User.findByPk(userId, { raw: true }),
      Tweet.findAll({
        where: { UserId: userId },
        include: [
          // 遇到 model User, 都要小心, 最好使用attributes: ['指定要傳那些資料出去']
          // 或是 使用 attributes: { exclude: ['不要傳出去的'] } }, 但是你不知道會不會傳出去些什麼
          { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
          { model: Reply },
          { model: Like }
        ],
        order: [['createdAt', 'DESC']]
      })
    ])
      .then(([user, tweetsData]) => {
        if (!user) throw new Error('getUserTweets說: 沒這人')
        const tweets = tweetsData.map(t => ({
          ...t.toJSON(),
          repliesCount: t.Replies.length,
          likesCount: t.Likes.length
        }))
        res.status(200).json(tweets)
      })
      .catch(err => next(err))
  },
  getUserReplies: (req, res, next) => {
    const userId = req.params.id
    return Promise.all([
      User.findByPk(userId),
      Reply.findAll({
        where: { UserId: userId },
        include: [
          { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
          {
            model: Tweet,
            include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar'] }]
          }
        ],
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']]
      })
    ])
      .then(([user, repliesData]) => {
        if (!user) throw new Error('getUserReplies說: 沒這人')
        res.status(200).json(repliesData)
      })
      .catch(err => next(err))
  },
  getUserLikes: (req, res, next) => {
    const userId = req.params.id
    return Promise.all([
      User.findByPk(userId),
      Like.findAll({
        where: { UserId: userId },
        include: [
          { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
          {
            model: Tweet,
            include: [
              { model: Reply },
              { model: Like }
            ]
          }
        ],
        order: [['createdAt', 'DESC']]
      })
    ])
      .then(([user, likesData]) => {
        if (!user) throw new Error('getUserLikes說: 沒這人')
        const likes = likesData.map(l => ({
          ...l.toJSON(),
          repliesCount: l.Tweet.Replies.length,
          likesCount: l.Tweet.Likes.length
        }))
        res.status(200).json(likes)
      })
      .catch(err => next(err))
  },
  getUserFollowings: (req, res, next) => {
    const userId = req.params.id
    return Promise.all([
      User.findByPk(userId),
      User.findByPk(userId, {
        include: [
          { model: User, as: 'Followings', attributes: ['id', 'name', 'account', 'avatar', 'introduction'] }
        ],
        order: [['createdAt', 'DESC']]
      })
    ])
      .then(([user, followingsData]) => {
        if (!user) throw new Error('getUserFollowings說: 沒這人')
        // const followings = followingsData.Followings.map(f => ({
        //   ...f.toJSON()
        //   // isFollowing: req.user && req.user.Followings.some(uf => uf.id === f.Followings.id)
        // }))
        res.status(200).json(followingsData.toJSON())
      })
      .catch(err => next(err))
  }
}

module.exports = userController
