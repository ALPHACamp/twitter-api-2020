const { User, Tweet, Reply, Like } = require('../models')
const { getUser } = require('../helpers/auth-helpers.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { imgurFileHandler } = require('../helpers/file-helpers.js')

const userController = {
  register: async (req, res, next) => {
    try {
      const { name, account, email, password, checkPassword } = req.body
      if (!name || !account || !email || !password || !checkPassword) throw new Error('所有欄位皆為必填!')
      if (name.length > 50) throw new Error()
      const userEmail = await User.findOne({ where: { email } })
      const userAccount = await User.findOne({ where: { account } })
      if (userEmail) throw new Error('email 已重複註冊！')
      if (userAccount) throw new Error('account 已重複註冊！')
      const hash = await bcrypt.hash(password, 10)
      let userData = await User.create({
        account,
        email,
        password: hash,
        name,
        avatar: 'https://i.imgur.com/NUfWDow.png',
        cover: 'https://i.imgur.com/ApSQQYH.png',
        introduction: 'Hello there!',
        role: 'user'
      })
      userData = userData.toJSON()
      return res.json({
        status: 'success',
        message: '註冊成功',
        data: { user: userData }
      })
    } catch (err) {
      next(err)
    }
  },
  login: async (req, res, next) => {
    try {
      console.log(req.user)
      const userData = await getUser(req)?.toJSON()
      delete userData.password
      const token = await jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      if (userData.role === 'admin') throw new Error('帳號不存在!')
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
  getUserInfo: async (req, res, next) => { // 元件之一, 提供自己/其他使用者頁的介紹資訊
    try {
      // if (req.user.dataValues.id.toString() !== req.params.id.toString()) throw new Error('非該用戶不可取得該用戶基本資料!')
      // 上面不需要, 因為每個人都可以互相瀏覽對方的資訊
      let userInfo = await User.findOne({
        where: { id: req.params.id },
        attributes: ['id', 'account', 'name', 'avatar', 'cover', 'introduction', 'role', 'email'],
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      })
      if (!userInfo || userInfo.role !== 'user') throw new Error('該用戶不存在')
      const follower = userInfo.Followings.length
      const following = userInfo.Followers.length
      userInfo = { ...userInfo.toJSON(), follower, following }
      delete userInfo.Followers
      delete userInfo.Followings
      return res.status(200).json(userInfo)
    } catch (err) {
      next(err)
    }
  },
  editUserInfo: async (req, res, next) => {
    try {
      let { id, name, account, email, password, checkPassword, introduction, avatar, cover } = req.body
      if (req.user.dataValues.id.toString() !== req.params.id.toString()) throw new Error('非該用戶不可編輯該用戶基本資料!')
      let userInfo = await User.findOne({
        where: { id },
        attributes: ['id', 'account', 'email', 'password', 'name', 'avatar', 'cover', 'introduction']
      })
      if (!userInfo) throw new Error('該用戶不存在!')
      if (!password) throw new Error('密碼與確認密碼不相符!')
      if (password !== checkPassword) throw new Error('密碼與確認密碼不相符!')
      const hash = await bcrypt.hash(password, 10)
      avatar = avatar ? await imgurFileHandler(avatar) : null
      cover = cover ? await imgurFileHandler(cover) : null
      userInfo = await userInfo.update({
        account,
        email,
        password: hash, // 為了不讓有心人拿到密碼, 所以並沒有將使用者原本的password傳到前端, 這也造成只要是進入到edit頁面都需要重新輸入password, 但此舉只是因為password不可空白, 並無身分認證功能
        name,
        avatar: avatar || userInfo.avarat,
        cover: cover || userInfo.cover,
        introduction
      })
      return res.status(200).json(userInfo)
    } catch (err) {
      next(err)
    }
  },
  getUserTweets: async (req, res, next) => { // 元件之一, 提供自己/其他使用者頁的介紹資訊
    try {
      let tweets = await Tweet.findAll({
        where: { UserId: req.params.id },
        include: [
          { model: User, attributes: ['name', 'avatar', 'account'] },
          Reply,
          Like
        ],
        order: [['createdAt', 'DESC']]
      })
      if (!req.params.id) throw new Error('該用戶不存在')
      tweets = await tweets.map(tweet => {
        return {
          id: tweet.id,
          userId: tweet.userId,
          description: tweet.description,
          createAt: tweet.createAt,
          updateAt: tweet.updateAt,
          userName: tweet.User.name,
          userAvatar: tweet.User.avatar,
          userAccount: tweet.User.account,
          repliesNum: tweet.Replies.length,
          likes: tweet.Likes.length
        }
      })
      console.log(tweets)
      return res.status(200).json(tweets)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
