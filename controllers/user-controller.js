const { User, Tweet, Reply, Like } = require('../models')
const { getUser } = require('../helpers/auth-helpers.js')
const { Op } = require('sequelize')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { imgurFileHandler } = require('../helpers/file-helpers.js')
const helpers = require('../_helpers')
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
      if (password !== checkPassword) throw new Error('密碼與確認密碼不相符!')
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
      const following = userInfo.Followings.length
      const follower = userInfo.Followers.length
      let isFollowed = false
      for (let i = 0; i < follower; i++) {
        if (userInfo.Followers[i].id.toString() === getUser(req).id.toString()) {
          isFollowed = true
          break
        }
      }
      userInfo = { ...userInfo.toJSON(), follower, following, isFollowed }
      delete userInfo.Followers
      delete userInfo.Followings
      return res.status(200).json(userInfo)
    } catch (err) {
      next(err)
    }
  },
  editUserInfo: async (req, res, next) => {
    try {
      console.log(helpers.getUser(req))
      const { name, account, email, password, checkPassword, introduction } = req.body
      const currentUser = helpers.getUser(req)
      const UserId = helpers.getUser(req).id
      const id = req.params.id
      const files = req.files
      const avatar = files?.avatar ? await imgurFileHandler(files.avatar[0]) : null
      const cover = files?.cover ? await imgurFileHandler(files.cover[0]) : null
      // 使用者只能編輯自己的資料
      if (Number(UserId) !== Number(id)) throw new Error('非該用戶不可編輯該用戶基本資料!')
      // 確認使用者是否存在
      let userInfo = await User.findOne({
        where: { id },
        attributes: ['id', 'account', 'email', 'password', 'name', 'avatar', 'cover', 'introduction']
      })
      if (!userInfo || userInfo.role === 'admin') throw new Error('該用戶不存在!')
      // 如有修改password，passwor與checkPassword是否相符
      if (password !== checkPassword) throw new Error('密碼與確認密碼不相符!')
      // 確認暱稱是否超過上限
      if (name && name.length > 50) throw new Error('name 超過字數限制50字元!')
      // 確認自我介紹是否超過上限
      if (introduction && introduction.length > 160) throw new Error('introduction 超過字數限制160字元!')
      // 如有修改account，確認是否與現有資料庫重複
      if (account) {
        const accountUser = await User.findOne({
          where: { account, id: { [Op.ne]: UserId } }
        })
        if (account !== currentUser.account && accountUser) throw new Error('Account 已重複註冊!')
      }
      // 如有修改email，確認是否與現有資料庫重複
      if (email) {
        const emailUser = await User.findOne({
          where: { email, id: { [Op.ne]: UserId } }
        })
        if (email !== currentUser.email && emailUser) throw new Error('Email 已重複註冊!')
      }

      userInfo = await userInfo.update({
        account: account || userInfo.account,
        email: email || userInfo.email,
        password: password ? bcrypt.hashSync(password, 10) : userInfo.password,
        name: name || userInfo.name,
        avatar: avatar || userInfo.avatar,
        cover: cover || userInfo.cover,
        introduction: introduction || userInfo.introduction
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
      tweets = await tweets.map(tweet => {
        return {
          id: tweet.id,
          userId: tweet.userId,
          description: tweet.description,
          createdAt: tweet.createdAt,
          updatedAt: tweet.updatedAt,
          userName: tweet.User.name,
          userAvatar: tweet.User.avatar,
          userAccount: tweet.User.account,
          repliesNum: tweet.Replies.length,
          likes: tweet.Likes.length
        }
      })
      return res.status(200).json(tweets)
    } catch (err) {
      next(err)
    }
  },
  getUserReplies: async (req, res, next) => {
    try {
      const replies = await Reply.findAll({
        where: { UserId: req.params.id },
        include: [
          { model: Tweet, include: [{ model: User, attributes: ['account'] }] }
        ],
        order: [['createdAt', 'DESC']]
      })
      return res.status(200).json(replies)
    } catch (err) {
      next(err)
    }
  },
  getUserLikes: async (req, res, next) => {
    try {
      let likedTweets = await Like.findAll({
        where: { UserId: req.params.id },
        include: [
          {
            model: Tweet,
            include: [
              { model: User, attributes: ['name', 'avatar', 'account'] },
              Reply,
              Like
            ]
          }
        ]
      })
      likedTweets = await Promise.all(likedTweets.map(async likedTweet => {
        return {
          TweetId: likedTweet.Tweet.id,
          userId: likedTweet.Tweet.userId,
          description: likedTweet.Tweet.description,
          createdAt: likedTweet.Tweet.createdAt,
          updatedAt: likedTweet.Tweet.updatedAt,
          userName: likedTweet.Tweet.User.name,
          userAvatar: likedTweet.Tweet.User.avatar,
          userAccount: likedTweet.Tweet.User.account,
          repliesNum: likedTweet.Tweet.Replies.length,
          likes: likedTweet.Tweet.Likes.length,
          likeCreatedAt: likedTweet.createdAt
        }
      }))
      likedTweets = likedTweets.sort((a, b) => b.createAt - a.createAt)
      return res.status(200).json(likedTweets)
    } catch (err) {
      next(err)
    }
  },
  getUserFollowings: async (req, res, next) => {
    try {
      let followings = await User.findAll({
        where: { id: req.params.id },
        attributes: ['id', 'account', 'name'],
        include: [
          { model: User, as: 'Followings', attributes: ['id', 'account', 'email', 'name', 'avatar', 'cover', 'introduction'] }
        ]
      })
      followings = followings[0].Followings
      followings = await Promise.all(followings.map(async following => {
        return {
          followshipId: following.Followship.id,
          followingId: following.id,
          followingAccount: following.account,
          followingName: following.name,
          followingAvatar: following.avatar,
          followingIntroduction: following.introduction,
          followshipCreatedAt: following.Followship.createdAt
        }
      }))
      followings = followings.sort((a, b) => b.createAt - a.createAt)
      return res.status(200).json(followings)
    } catch (err) {
      next(err)
    }
  },
  getUserFollowers: async (req, res, next) => {
    try {
      let followers = await User.findAll({
        where: { id: req.params.id },
        attributes: ['id', 'account', 'name'],
        include: [
          { model: User, as: 'Followers', attributes: ['id', 'account', 'email', 'name', 'avatar', 'cover', 'introduction'], order: [['createdAt', 'DESC']] }
        ]
      })
      followers = followers[0].Followers
      followers = await Promise.all(followers.map(async follower => {
        return {
          followshipId: follower.Followship.id,
          followerId: follower.id,
          followerAccount: follower.account,
          followerName: follower.name,
          followerAvatar: follower.avatar,
          followerIntroduction: follower.introduction,
          followshipCreatedAt: follower.Followship.createdAt
        }
      }))
      followers = followers.sort((a, b) => b.createAt - a.createAt)
      return res.status(200).json(followers)
    } catch (err) {
      next(err)
    }
  },
  getTopUsers: async (req, res, next) => {
    try {
      let users = await User.findAll({
        where: { role: 'user' },
        attributes: ['id', 'name', 'account', 'avatar'],
        include: [
          { model: User, as: 'Followers' }
        ]
      })
      const isFollowed = []
      for (let j = 0; j < users.length; j++) {
        if (!users[j].Followers[0])isFollowed.push(false)
        for (let i = 0; i < users[j].Followers.length; i++) {
          console.log(users[j].id, users[j].Followers[i].id.toString())
          if (users[j].Followers[i].id?.toString() === getUser(req).id.toString()) {
            isFollowed.push(true)
            break
          } else {
            isFollowed.push(false)
          }
        }
      }
      console.log(isFollowed)
      users = await Promise.all(users.map(async (user, isFollowedBoolean) => {
        return {
          userName: user.name,
          userId: user.id,
          userAccount: user.account,
          userAvatar: user.avatar,
          followerCount: user.Followers.length,
          isFollowed: isFollowed[isFollowedBoolean]
        }
      }))
      users = users.sort((a, b) => b.followerCount - a.followerCount)
      let topUsers = []
      for (let i = 0; i < 10; i++) {
        if (!users[i]) break // 避免少於10位用戶時還要回傳null
        topUsers = topUsers.concat(users[i])
      }
      return res.status(200).json(topUsers)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
