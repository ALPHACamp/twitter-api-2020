const jwt = require('jsonwebtoken')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const createError = require('http-errors')
const { getUser } = require('../_helpers')
const { User, Tweet, Like, Reply, sequelize } = require('../models')

const userController = {
  login: (req, res, next) => {
    try {
      const loginUser = getUser(req)
      if ((req.originalUrl === '/api/users/login' && loginUser.role !== 'user') || (req.originalUrl === '/api/admin/login' && loginUser.role !== 'admin')) throw createError(404, '帳號不存在')

      const token = jwt.sign({ id: loginUser.id }, process.env.JWT_SECRET, { expiresIn: '30d' })
      return res.json({
        status: 'success',
        message: '登入成功',
        token
      })
    } catch (error) {
      next(error)
    }
  },
  register: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body

    if (!account || !name || !email || !password || !checkPassword) throw createError(400, '欄位不得為空')
    if (name.length > 50) throw createError(422, '名稱不能超過 50 個字')
    if (!validator.isEmail(email)) throw createError(422, 'Email 格式有誤')
    if (password !== checkPassword) throw createError(422, '兩次輸入的密碼不相同')

    return Promise.all([
      User.findOne({ where: { account }, raw: true }),
      User.findOne({ where: { email }, raw: true })
    ])
      .then(([foundAccount, foundEmail]) => {
        if (foundAccount) throw createError(422, 'Account 重複註冊')
        if (foundEmail) throw createError(422, 'Email 重複註冊')

        return User.create({ account, name, email, password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)) })
      })
      .then(() => {
        return res.json({
          status: 'success',
          message: '註冊成功'
        })
      })
      .catch(error => next(error))
  },
  getUser: (req, res, next) => {
    const { id } = req.params

    return User.findByPk(id, {
      attributes: [
        'id', 'account', 'name', 'introduction', 'avatar', 'cover', 'role',
        [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE follower_id = User.id)'), 'followingCount'],
        [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE following_id = User.id)'), 'followerCount']
      ]
    })
      .then(user => {
        if (!user || user.role === 'admin') throw createError(404, '帳號不存在')

        return res.json(user)
      })
      .catch(error => next(error))
  },
  // 查看特定使用者發過的推文
  getUserTweets: (req, res, next) => {
    // login user 一包資料
    const loginUser = getUser(req)
    // 動態 id user
    const UserId = Number(req.params.id)

    // 找出動態 id 的 User, Tweet, Like table 資料
    Promise.all([
      User.findByPk(UserId),
      Tweet.findAll({
        raw: true,
        nest: true,
        where: { UserId },
        include: [{ model: User, attributes: ['id', 'account', 'name', 'avatar'] }],
        attributes: {
          include: [
            // 直接計算回覆數、like 數
            [sequelize.literal(
              '(SELECT COUNT(*) FROM Replies WHERE Tweet_id = Tweet.id )'
            ), 'replyCounts'],
            [sequelize.literal(
              '(SELECT COUNT(*) FROM Likes  WHERE Tweet_id = Tweet.id )'
            ), 'likeCounts']
          ]
        },
        // 推文規格要 DESC
        order: [['createdAt', 'DESC']]
      }),
      Like.findAll({ where: { UserId } })
    ])
      .then(([user, tweets, likes]) => {
        // 401: 請先登入 & 403:沒有使用該頁面的權限，在 middleware/auth
        if (!user) throw createError(404, '該使用者不存在')
        const result = tweets.map(tweet => ({
          ...tweet,
          // like 為 true 條件：查找 like table 裡的 userId 是否有 login 本人
          // 這裡有點抖抖，有需要再加 like.TweetId === tweet.id 判斷？
          isLiked: likes.some(like => like.UserId === loginUser.id)
        }))

        return res.json(result)
      })
      .catch(err => next(err))
  },
  // 查看特定使用者發過回覆的推文
  getUserReplies: (req, res, next) => {
    // 動態 id user
    const UserId = Number(req.params.id)

    // 找出動態 id 的 User, reply table 資料
    Promise.all([
      User.findByPk(UserId),
      Reply.findAll({
        where: { UserId },
        // reply table 找出 user.id，並對應 id 找出 user table 裡面的資料
        // 對應 id 找出 tweet table 裡的 user 資料
        include: [
          { model: User, attributes: ['id', 'account', 'name', 'avatar'] },
          { model: Tweet, attributes: { exclude: ['id', 'description', 'createdAt', 'updatedAt'] }, include: { model: User, attributes: ['id', 'account'] } }
        ],
        // 推文規格要 DESC
        order: [['createdAt', 'DESC']]
      })
    ])
      .then(([user, replies]) => {
        // 401: 請先登入 & 403:沒有使用該頁面的權限，在 middleware/auth
        if (!user) throw createError(404, '該使用者不存在')

        return res.json(replies)
      })
      .catch(err => next(err))
  }
}

module.exports = userController
