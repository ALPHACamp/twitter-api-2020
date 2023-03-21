const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { User, Tweet, Reply, Like, Followship, sequelize } = require('../models')
const helpers = require('../_helpers')

const userServices = {
  signIn: (req, cb) => {
    try {
      const userData = helpers.getUser(req).toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      cb(null, { token, user: userData })
    } catch (err) {
      cb(err)
    }
  },
  signUp: (req, cb) => {
    const { account, name, email, password } = req.body
    User.findOne({ where: { account: req.body.account } })
    return bcrypt.hash(password, 10)
      .then(hash => User.create({
        account,
        name,
        email,
        password: hash
      }))
      .then(newUser => cb(null, { user: newUser }))
      .catch(err => cb(err))
  },
  getUser: (req, cb) => {
    const userId = req.params.id
    return User.findByPk(userId, {
      include: [
        { model: Tweet },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
      .then(getUser => cb(null, { user: getUser }))
      .catch(err => cb(err))
  },
  putUser: (req, cb) => {
    const userId = req.params.id
    const { account, name, email, password, checkPassword } = req.body
    if (!account || !name || !email || !password) throw new Error('還有欄位沒填')
    if (account.trim().length === 0 || name.trim().length === 0 || email.trim().length === 0 || password.trim().length === 0) throw new Error('還有欄位沒填')
    if (password !== checkPassword) throw new Error('密碼與確認密碼不一樣!')
    if (name && name.length > 50) throw new Error('暱稱上限50字!')
    Promise.all([
      User.findByPk(userId),
      User.findOne({ where: { account } }),
      User.findOne({ where: { email } })
    ])
      .then(([user, userAccount, userEmail]) => {
        if (userAccount && userAccount.id !== helpers.getUser(req).id) throw new Error('帳號已經註冊過!')
        if (userEmail && userEmail.id !== helpers.getUser(req).id) throw new Error('帳號已經註冊過!')
        return user.update({
          account,
          name,
          email,
          password: bcrypt.hashSync(password, 10)
        })
          .then(putUser => {
            putUser = putUser.toJSON()
            delete putUser.password
            cb(null, putUser)
          })
      })
  },
  getUserTweets: (req, cb) => {
    const nowUser = helpers.getUser(req)
    const userId = req.params.id
    return Tweet.findAll({
      where: { UserId: userId },
      include: [
        {
          model: User,
          attributes: ['id', 'account', 'avatar', 'name']
        }
      ],
      attributes: {
        exclude: ['updatedAt'],
        include: [
          'id',
          'UserId',
          'description',
          'createdAt',
          [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.tweet_id = Tweet.id)'), 'replyCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.tweet_id = Tweet.id)'), 'likeCount'],
          [sequelize.literal(`EXISTS (SELECT id FROM Likes WHERE Likes.user_id = ${nowUser.id} AND Likes.tweet_id = Tweet.id)`), 'liked']
        ]
      },
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true
    })
      .then(tweets => {
        if (!tweets) throw new Error('這篇推文不存在!')
        cb(null, tweets)
      })
      .catch(err => cb(err))
  }
}

module.exports = userServices
