const bcrypt = require('bcryptjs')
const { User, Tweet, Reply, Like } = require('../models')
const jwt = require('jsonwebtoken')
const helpers = require('../_helpers')
const validator = require('email-validator')
const { Op } = require('sequelize')
const userController = {
  signIn: async (req, res, next) => {
    try {
      const userJSON = helpers.getUser(req).toJSON()
      delete userJSON.password
      if (userJSON.role !== 'user') throw new Error('你無法登入此帳號')
      const token = jwt.sign(userJSON, process.env.JWT_SECRET, { expiresIn: '30d' })// 簽證效期30天
      return res.status(200).json({ token, message: '登入成功' })
    } catch (err) { next(err) }
  },
  signUp: async (req, res, next) => {
    try {
      const { name, email, password, account, checkPassword } = req.body
      if (!name || !email || !password || !account || !checkPassword) throw new Error('請填寫所有必填欄位')
      // Check password and check Password must be the same
      if (password !== checkPassword) throw new Error('Passwords do not match')
      // Check name.length must < 50
      if (name.length > 50) throw new Error('使用者註冊名稱(name)上限為50字')
      // Check if email matches the required format
      if (!validator.validate(email)) throw new Error('Email格式不正確!')
      // check if user with given email or account already exists
      const existingAccount = await User.findOne({ where: { account: account } })
      const existingEmail = await User.findOne({ where: { email: email } })
      if (existingAccount) { throw new Error('account已重複註冊!') }
      if (existingEmail) { throw new Error('email已重複註冊!') }
      // If user does not exist, hash password and create new user
      const hash = await bcrypt.hash(password, 10)
      await User.create({
        name,
        email,
        password: hash,
        account,
        role: 'user'
      })
      return res.status(200).json({ message: '註冊成功' })
    } catch (err) { next(err) }
  },
  getUser: async (req, res, next) => {
    try {
      const userId = req.params.id
      const reqUserId = helpers.getUser(req).id
      const user = await User.findByPk(userId, {
        attributes: { exclude: ['password'] },
        include: [
          Tweet,
          { model: User, as: 'Followers', attributes: { exclude: ['password'] } },
          { model: User, as: 'Followings', attributes: { exclude: ['password'] } }
        ]
      })
      if (!user || user.role === 'admin') throw new Error('帳號不存在!')
      user.dataValues.isFollowed = user.Followers.map(u => u.id).includes(reqUserId)
      return res.status(200).json(user)
    } catch (err) { next(err) }
  },
  getUserTweets: async (req, res, next) => {
    try {
      const userId = Number(req.params.id)
      const user = await User.findByPk(userId)
      if (!user) throw new Error('此用戶不存在')
      const tweets = await Tweet.findAll({
        where: { UserId: userId },
        include: [
          { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
          { model: Like, attributes: ['userId'] }
        ],
        order: [['createdAt', 'DESC']]
      })
      if (tweets.length === 0) throw new Error('此用戶尚未發布推文')
      return res.status(200).json(tweets)
    } catch (err) { next(err) }
  },
  getUserReplies: async (req, res, next) => {
    try {
      const userId = req.params.id
      const userReplies = await Reply.findAll({
        where: { UserId: userId },
        include: [
          { model: Tweet }
        ],
        order: [['createdAt', 'DESC']]
      })
      const RepliesJSON = userReplies.map(r => r.toJSON())
      if (RepliesJSON.length === 0) throw new Error('此用戶沒有回覆任何貼文')
      return res.status(200).json(RepliesJSON)
    } catch (err) { next(err) }
  },
  getLikedTweets: async (req, res, next) => {
    try {
      const userId = req.params.id
      const likesTweets = await Like.findAll({
        where: { UserId: userId },
        include: [
          { model: Tweet, include: { model: User, attributes: ['name', 'account', 'avatar'] } }
        ],
        order: [['createdAt', 'DESC']]
      })
      return res.status(200).json(likesTweets)
    } catch (err) { next(err) }
  },
  getFollowings: async (req, res, next) => {
    try {
      const userId = req.params.id
      const followings = await User.findByPk(userId, {
        include: {
          model: User,
          as: 'Followings',
          attributes: [
            ['id', 'followingId'],
            'name',
            'account',
            'avatar',
            'cover',
            'introduction'
          ]
        },
        attributes: [
          ['id', 'userId'],
          'name',
          'account',
          'avatar',
          'cover'
        ]
      })
      if (followings.Followings.length === 0) throw new Error('該用戶沒有追蹤對象')
      const followingId = helpers.getUser(req).Followings.map(user => user.id)
      const result = followings.Followings
        .map(f => ({
          ...f.toJSON(),
          isFollowed: followingId.includes(f.toJSON().followingId) || false
        }))
        .sort((a, b) => b.Followship.createdAt.getTime() - a.Followship.createdAt.getTime())
      result.forEach(i => delete i.Followship)
      return res.status(200).json(result)
    } catch (err) { next(err) }
  },
  getFollowers: async (req, res, next) => {
    try {
      const userId = req.params.id
      const followers = await User.findByPk(userId, {
        include: {
          model: User,
          as: 'Followers',
          attributes: [
            ['id', 'followerId'],
            'name',
            'account',
            'avatar',
            'cover',
            'introduction'
          ]
        },
        attributes: [
          ['id', 'userId'],
          'name',
          'account',
          'avatar',
          'cover'
        ]
      })
      if (followers.Followers.length === 0) throw new Error('該用戶沒有追蹤者')
      const followingId = helpers.getUser(req).Followings.map(user => user.id)
      const result = followers.Followers
        .map(f => ({
          ...f.toJSON(),
          isFollowed: followingId.includes(f.toJSON().followerId) || false
        }))
        .sort((a, b) => b.Followship.createdAt.getTime() - a.Followship.createdAt.getTime())
      result.forEach(i => delete i.Followship)
      return res.status(200).json(result)
    } catch (err) { next(err) }
  },
  putUser: async (req, res, next) => {
    try {
      const { name, introduction, avatar, cover } = req.body
      const userId = helpers.getUser(req).id
      const user = await User.findByPk(userId)
      if (!user) throw new Error('User not found!')
      if (introduction.length > 160 || name.length > 50) throw new Error('字數超出上限')
      const updatedUser = await user.update({
        name: name || user.name,
        avatar: avatar || user.avatar,
        cover: cover || user.cover,
        introduction: introduction || user.introduction
      })
      const responseData = {
        name: updatedUser.name,
        avatar: updatedUser.avatar,
        cover: updatedUser.cover,
        introduction: updatedUser.introduction
      }
      return res.status(200).json({ data: responseData, message: '修改成功' })
    } catch (err) { next(err) }
  },
  putUserSetting: async (req, res, next) => {
    try {
      const { name, password, account, email, checkPassword } = req.body
      if (password !== checkPassword) throw new Error('Passwords do not match')
      const userId = helpers.getUser(req).id
      if (name.length > 51) throw new Error('使用者註冊名稱(name)上限為50字')
      if (!validator.validate(email)) throw new Error('Email格式不正確!')
      const existingAccount = await User.findAll({ where: { [Op.or]: [{ account }, { email }] } })
      if (existingAccount.some(user => user.account === account && user.id !== userId)) throw new Error('account已重複註冊!')
      if (existingAccount.some(user => user.email === email && user.id !== userId)) throw new Error('email已重複註冊!')
      const user = await User.findByPk(userId)
      if (!user) throw new Error('User not found!')
      const hash = await bcrypt.hash(password, 10)
      const updatedUser = await user.update({
        name: name || user.name,
        password: hash || user.password,
        account: account || user.account,
        email: email || user.email
      })
      const responseData = {
        name: updatedUser.name,
        account: updatedUser.account,
        email: updatedUser.email
      }
      return res.status(200).json({ data: responseData, message: '修改成功' })
    } catch (err) { next(err) }
  },
  getUsersTop10: async (req, res, next) => {
    try {
      const users = await User.findAll({
        include: {
          model: User,
          as: 'Followers',
          attributes: ['id', 'email', 'name', 'account', 'avatar']
        },
        attributes: ['id', 'name', 'account', 'avatar', 'createdAt'],
        where: { role: { [Op.not]: 'admin' } }
      })
      const userTop = users.map(user => ({
        ...user.toJSON(), // 整理格式
        followersCount: user.Followers.length, // 計算追蹤者數量
        isFollowed: helpers.getUser(req).Followings.some(f => f.id === user.id) // 判斷目前登入使用者是否追蹤該物件
      })).sort((a, b) => b.followersCount - a.followersCount)// 按照人數多->少排序
        .slice(0, 10)
      return res.status(200).json(userTop)
    } catch (err) { next(err) }
  }
}

module.exports = userController
