// 載入所需套件
const { User, Tweet, Reply } = require('../models')
const bcrypt = require('bcryptjs')
const { Op } = require('sequelize')
const sequelize = require('sequelize')
const jwt = require('jsonwebtoken')
const helpers = require('../_helpers')
const imgur = require('imgur')

const userService = {
  signUp: async (req, res, callback) => {
    const { account, name, email, password, checkPassword } = req.body

    // 確認欄位是否皆有填寫
    if (!account || !name || !email || !password || !checkPassword) {
      return callback({ status: 'error', message: '所有欄位皆為必填' })
    }
    // 確認密碼是否一致
    if (password !== checkPassword) {
      return callback({ status: 'error', message: '兩次密碼不相同' })
    }

    // 確認email或account是否重複
    const user = await User.findOne({ where: { [Op.or]: [{ email }, { account }] } })
    if (user) {
      if (user.email === email) {
        return callback({ status: 'error', message: 'email已重覆註冊！' })
      }
      if (user.account === account) {
        return callback({ status: 'error', message: 'account已重覆註冊！' })
      }
    } else {
      await User.create({
        account,
        email,
        name,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
        role: 'user'
      })
      return callback({ status: 'success', message: '成功註冊' })
    }
  },

  signIn: async (req, res, callback) => {
    const { email, password } = req.body

    // 確認欄位是否皆有填寫
    if (!email || !password) {
      return callback({ status: 'error', message: 'email或password未填寫' })
    }

    // 檢查email＆password＆role
    const user = await User.findOne({ where: { email } })
    if (!user || !bcrypt.compareSync(password, user.password) || user.role === 'admin') {
      return callback({ status: 'error', message: '帳號不存在！' })
    }

    const payload = { id: user.id }
    const token = jwt.sign(payload, process.env.JWT_SECRET)
    return callback({
      status: 'success',
      message: '成功登入',
      token: token,
      user: {
        id: user.id, account: user.account, name: user.name, email: user.email, avatar: user.avatar, cover: user.cover, introduction: user.introduction, role: user.role
      }
    })
  },

  putUserSetting: async (req, res, callback) => {
    const { account, name, email, password, checkPassword } = req.body
    const userId = helpers.getUser(req).id

    // 確認當前使用者和欲修改使用者資料是相同的
    if (userId !== Number(req.params.id)) {
      return callback({ status: 'error', message: '無法變更其他使用者資料' })
    }

    // 確認欄位是否皆有填寫
    if (!account || !name || !email || !password || !checkPassword) {
      return callback({ status: 'error', message: '所有欄位皆需填寫' })
    }

    // 確認密碼是否一致
    if (password !== checkPassword) {
      return callback({ status: 'error', message: '兩次密碼不相同' })
    }

    // 確認email或account是否重複(要排除自己的)
    const check = await User.findOne({ where: { [Op.or]: [{ email }, { account }], [Op.not]: [{ id: userId }] } }) // 利用[Op.not]忽略自己email和account
    if (check) {
      if (check.email === email) {
        return callback({ status: 'error', message: 'email已重覆註冊！' })
      }
      if (check.account === account) {
        return callback({ status: 'error', message: 'account已重覆註冊！' })
      }
    } else {
      await User.update({
        ...req.body,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
      }, { where: { id: userId } })
      return callback({ status: 'success', message: '成功修改使用者帳戶資訊' })
    }
  },

  putUser: async (req, res, callback) => {
    const userId = helpers.getUser(req).id

    // 確認當前使用者和欲修改使用者資料是相同的
    if (userId !== Number(req.params.id)) {
      return callback({ status: 'error', message: '無法變更其他使用者資料' })
    }

    // 確認name有填寫
    if (!req.body.name) {
      return callback({ status: 'error', message: 'name為必填欄位' })
    }

    // 如果有上傳圖片，就上傳到imgur中
    const { files } = req
    imgur.setClientId(process.env.IMGUR_CLIENT_ID) // 設定imgur的clientId
    if (files) {
      if (files.avatar) {
        // 確認是否有avatar上傳，有就上傳到imgur
        const avatar = await imgur.uploadFile(files.avatar[0].path)
        req.body.avatar = avatar.link
      }
      if (files.cover) {
        // 確認是否有cover上傳，有就上傳到imgur
        const cover = await imgur.uploadFile(files.cover[0].path)
        req.body.cover = cover.link
      }
    }

    await User.update({ ...req.body }, { where: { id: userId } })
    return callback({ status: 'success', message: '成功修改使用者Profile' })
  },

  getCurrentUser: async (req, res, callback) => {
    return callback({ user: helpers.getUser(req) })
  },

  getUser: async (req, res, callback) => {
    const currentUserId = helpers.getUser(req).id // 當前使用者id
    const userId = req.params.id // 欲取得特定使用者資料的id

    // 取得當前使用者的資訊
    if (currentUserId === Number(userId)) {
      const user = (await User.findByPk(userId, {
        attributes: ['id', 'account', 'name', 'avatar', 'cover', 'introduction',
          // followings => 該使用者關注幾個其他人，followers => 該使用者被幾個其他人跟隨
          [sequelize.literal(`(select count(followerId) from Followships where followerId = User.id)`), 'followings'], [sequelize.literal(`(select count(followingId) from Followships where followingId = User.id)`), 'followers'],
          [sequelize.literal(`(select count(UserId) from Tweets where UserId = User.id)`), 'tweetsCounts']
        ]
      })).toJSON()
      return callback(user)
    } else {
      // 取得其他使用者資訊(要有isFollowed => 利用SQL原生語法判斷)
      const user = (await User.findByPk(userId, {
        attributes: ['id', 'account', 'name', 'avatar', 'cover', 'introduction',
          [sequelize.literal(`(select count(followerId) from Followships where followerId = User.id)`), 'followings'], [sequelize.literal(`(select count(followingId) from Followships where followingId = User.id)`), 'followers'],
          [sequelize.literal(`exists(select 1 from Followships where followerId = ${currentUserId} and followingId = User.id)`), 'isFollowed'],
          [sequelize.literal(`(select count(UserId) from Tweets where UserId = User.id)`), 'tweetsCounts']
        ]
      })).toJSON()
      return callback(user)
    }
  },

  getUserTweets: async (req, res, callback) => {
    const currentUserId = helpers.getUser(req).id
    const tweets = await Tweet.findAll({
      where: { UserId: req.params.id },
      raw: true,
      nest: true,
      // 利用SQL原生語法判別tweet是否有被當前使用者按讚
      attributes: ['id', 'description', 'createdAt',
        [sequelize.literal(`(select count(TweetId) from Likes where TweetId = Tweet.id)`), 'likeCounts'],
        [sequelize.literal(`(select count(TweetId) from Replies where TweetId = Tweet.id)`), 'commentCounts'],
        [sequelize.literal(`exists(select 1 from Likes where UserId = ${currentUserId} and TweetId = Tweet.id)`), 'isLiked']
      ],
      include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar'] }],
      order: [['createdAt', 'DESC']]
    })
    return callback(tweets)
  },

  getUserReplies: async (req, res, callback) => {
    const replies = await Reply.findAll({
      where: { UserId: req.params.id },
      raw: true,
      nest: true,
      attributes: ['id', 'comment', 'createdAt'],
      include: [
        { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
        { model: Tweet, attributes: ['id'], include: [{ model: User, attributes: ['account'] }] } // 關聯出被回覆的推文資訊
      ],
      order: [['createdAt', 'DESC']]
    })
    return callback(replies)
  },
}

// userController exports
module.exports = userService