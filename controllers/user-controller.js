const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User, Tweet, Reply, Like, Followship, sequelize } = require('../models')
const helpers = require('../_helpers')
const Op = require('../models').Sequelize.Op

const userController = {

  signUp: (req, res, next) => {
    const {
      account,
      name,
      email,
      password,
      checkPassword
    } = req.body
    if (password !== checkPassword) throw new Error('密碼兩次輸入不同')
    // console.log(email + name)
    return Promise.all([
      User.findOne({ where: { email: req.body.email } }),
      User.findOne({ where: { account: req.body.account } })])
      .then(([email, account]) => {
        if (email) throw new Error('email 已重複註冊！')
        if (account) throw new Error('account 已重複註冊！')
        return bcrypt.hash(password, 10)
      })
      .then(hash => {
        return User.create({ account, password: hash, name, email })
      })
      .then(registerUser => {
        const user = registerUser.toJSON()
        delete user.password
        return res.status(200).json(user)
      })
      .catch(err => next(err))
  },
  signIn: (req, res, next) => {
    const { account, password } = req.body

    if (!account || !password) { throw new Error('所有欄位都要填寫') }
    return User.findOne({ where: { account } })
      .then(user => {
        if (!user) { throw new Error('帳號不存在!') }
        if (user.role === 'admin') throw new Error('帳號不存在！')
        return Promise.all([bcrypt.compare(password, user.password), user])
      })
      .then(([isMatched, user]) => {
        if (!isMatched) { throw new Error('密碼錯誤') }
        const userData = user.toJSON()
        delete userData.password
        const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
        return res.json({ status: 'success', token, user: userData })
      })
      .catch(error => next(error))
  },
  getUser: (req, res, next) => {
    const userId = Number(req.params.id)
    User.findByPk(userId)
      .then(user => {
        if (!user) throw new Error('帳號不存在')
        // if (user.role === 'admin') throw new Error('帳號不存在！')
        return res.status(200).json(user)
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const getUserId = Number(req.params.id)
    const { name, introduction, avatar, cover } = req.body
    if (!name) throw new Error('name is required!')
    // if (helpers.getUser(req).id !== getUserId) throw new Error('帳號驗證不通過')
    return User.findByPk(getUserId)
      .then(user => {
        if (!user) throw new Error('帳號不存在！')
        return user.update({ name, introduction, avatar, cover })
      })
      .then(updatedUser => res.status(200).json({ user: updatedUser }))
      .catch(err => next(err))
  },
  getUserTweets: async (req, res, next) => {
    try {
      const error = new Error()
      const targetUserId = req.params.id
      const loginUserId = helpers.getUser(req).id

      if (isNaN(targetUserId) || !(await User.findByPk(targetUserId))) {
        error.code = 404
        error.message = '對應使用者不存在'
        return next(error)
      }

      const tweets = await Tweet.findAll({
        where: { UserId: targetUserId },
        attributes: [
          'id',
          'UserId',
          'description',
          'createdAt',
          'updatedAt',
          'likeCount',
          'replyCount',
          [
            sequelize.literal(
              `EXISTS (SELECT 1 FROM Likes WHERE UserId = ${loginUserId} AND TweetId = Tweet.id)`
            ),
            'isLiked'
          ],
          [
            sequelize.literal(
              `EXISTS (SELECT 1 FROM Replies WHERE UserId = ${loginUserId} AND TweetId = Tweet.id)`
            ),
            'isReplied'
          ]
        ],
        include: [
          { model: User, attributes: ['id', 'name', 'account', 'avatar'] }
        ],
        order: [['createdAt', 'DESC']]
      })

      const results = tweets.map(t => {
        t = t.toJSON()
        t.isLiked = Boolean(t.isLiked)
        t.isReplied = Boolean(t.isReplied)
        return t
      })

      return res.json([...results])
    } catch (err) {
      next(err)
    }
  },
  getRepliedTweets: (req, res, next) => {
    const userId = Number(req.params.id)
    return Promise.all([
      User.findByPk(userId),
      Reply.findAll({
        where: { UserId: userId },
        attributes: ['id', 'comment', 'createdAt', 'tweetId'],
        include: [{
          model: Tweet,
          attributes: ['id', 'description', 'createdAt', 'replyCount', 'likeCount'],
          include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar'] }
          ]
        }]
      })
    ])
      .then(([user, replies]) => {
        if (!user) { throw new Error('帳號不存在!') }
        if (!replies) throw new Error('使用者沒有回覆任何推文!')
        return res.status(200).json(replies)
      })
      .catch(err => next(err))
  },
  getLikes: (req, res, next) => {
    const userId = Number(req.params.id)
    return Like.findAll({
      where: { userId: userId },
      attributes: ['id', 'createdAt', 'TweetId'],
      order: [['createdAt', 'DESC']],
      include: [{
        model: Tweet,
        attributes: ['id', 'description', 'createdAt', 'replyCount', 'likeCount'],
        include: [{
          model: User,
          attributes: ['id', 'name', 'account', 'avatar']
        }]
      }]
    })
      .then(userLikes => {
        if (!userLikes) throw new Error('使用者並未喜歡任何推文!')
        return res.status(200).json(userLikes)
      })
      .catch(err => next(err))
  },
  getUserFollowings: (req, res, next) => {

  },
  getUserFollowers: (req, res, next) => {

  },
  getTopUsers: async (req, res, next) => {
    try {
      const user = helpers.getUser(req)
      const users = await User.findAll({
        where: {
          id: {
            [Op.ne]: user.id
          },
          role: 'user'
        },
        include: [{ model: User, as: 'Followers', attributes: { exclude: ['password'] } }],
        attributes: [
          'id',
          'name',
          'avatar',
          'account',
          'followerCount'
        ],
        order: [[sequelize.literal('followerCount'), 'DESC']],
        limit: 10
      })

      const followedUsers = helpers.getUser(req).Followings

      const results = users.map(u => ({
        ...u.toJSON(),
        isFollowed: followedUsers.some(fu => fu.id === u.id)
      }))

      return res.json({ status: 'success', message: '成功獲取', data: results })
    } catch (err) {
      next(err)
    }
  },
  getCurrentUser: async (req, res, next) => {
    try {
      const userId = helpers.getUser(req).id

      const currentUser = await User.findByPk(userId, {
        attributes: [
          'id',
          'account',
          'email',
          'name',
          'avatar',
          'role',
          'cover',
          'followerCount',
          'followingCount',
          'tweetCount'
        ]
      })
      return res.json({ status: 'success', message: '成功獲取當下登入的使用者', data: currentUser })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
