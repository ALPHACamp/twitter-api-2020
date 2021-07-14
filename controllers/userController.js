const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const { User, Tweet, Reply, Like, Followship } = require('../models')
const Sequelize = require('sequelize')
const bcrypt = require('bcryptjs')
const moment = require('moment')
const jwt = require('jsonwebtoken')

const imgurUpload = (file) => {
  return new Promise((resolve, reject) => {
    imgur.setClientID(IMGUR_CLIENT_ID)
    imgur.upload(file.path, (err, img) => {
      if (err) {
        reject(err)
      }
      resolve(img)
    })
  })
}

const userController = {
  signUp: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      if (!account || !name || !email || !password || !checkPassword) {
        return res.json({ status: 'error', message: '所有欄位皆為必填！' })
      } else if (checkPassword !== password) {
        return res.json({ status: 'error', message: '密碼與確認密碼不符！' })
      } else {
        const sameEmailUser = await User.findOne({ where: { email } })
        if (sameEmailUser) {
          return res.json({ status: 'error', message: '此Email已存在。' })
        }
        const sameAccountUser = await User.findOne({ where: { account } })
        if (sameAccountUser) {
          return res.json({ status: 'error', message: '此帳號已存在。' })
        }
        await User.create({
          account,
          name,
          email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
        })
        return res.json({ status: 'success', message: '帳號註冊成功！' })
      }
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  signIn: async (req, res, next) => {
    try {
      const { email, password } = req.body
      // 檢查必填資料
      if (!email || !password) {
        return res.json({ status: 'error', message: 'Email跟密碼皆為必填！' })
      }
      // 檢查 user 是否存在和密碼是否正確
      const user = await User.findOne({ where: { email } })
      if (!user) {
        return res.json({ status: 'error', message: '找不到此Email。' })
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return res.json({ status: 'error', message: '帳號或密碼不正確！' })
      }
      // 檢查是否為管理者
      if (user.role === 'admin') {
        return res.json({ status: 'error', message: '管理者無法登入前台！' })
      }
      // 簽發 token
      const payload = { id: user.id }
      const token = jwt.sign(payload, 'SimpleTwitterSecret')
      return res.json({
        status: 'success',
        message: '登入成功！',
        token: token,
        user: {
          // 這包user回傳資料可依前端需求增減
          id: user.id, account: user.account, name: user.name, email: user.email, role: user.role, avatar: user.avatar
        }
      })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  getUser: async (req, res, next) => {
    try {
      let user = await User.findOne({
        where: { id: req.params.id },
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      })
      const { id, name, account, email, role,
        avatar, cover, introduction, followingCounts, followerCounts } = user
      const isFollowed = req.user.Followings.map(f => f.id).includes(id)
      return res.json({
        id, name, account, email, role,
        avatar, followingCounts, followerCounts,
        cover, introduction, isFollowed,
        Followers: user.Followers, Followings: user.Followings
      })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  getTopFollowedUsers: async (req, res, next) => {
    try {
      const topLimit = 10
      const results = await User.findAll({
        raw: true,
        nest: true,
        where: { role: 'normal' },
        attributes: ['id', 'name', 'account', 'avatar', 'followerCounts'],
        limit: topLimit,
        order: [['followerCounts', 'DESC']]
      })
      const topUsers = results.map(topUser => ({
        ...topUser,
        isFollowed: req.user.Followings.map(f => f.id).includes(topUser.id)
      }))
      return res.json(topUsers)
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  getLikedTweets: async (req, res, next) => {
    try {
      let likes = await Like.findAll({
        raw: true,
        nest: true,
        where: { UserId: req.params.id },
        include: [{
          model: Tweet,
          attributes: ['id', 'description', 'replyCounts', 'likeCounts', 'createdAt'],
          include: [{ model: User, attributes: ['id', 'account', 'name', 'avatar'] }]
        }],
        order: [['createdAt', 'DESC']]
      })
      const Tweets = likes.map(like => {
        return {
          ...like.Tweet,
          TweetId: like.Tweet.id,
          createdAt: moment(like.Tweet.createdAt).format('YYYY-MM-DD hh:mm:ss a')
        }
      })
      return res.json(Tweets)
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  getReplies: async (req, res, next) => {
    try {
      const results = await Reply.findAll({
        raw: true,
        nest: true,
        where: { UserId: req.params.id },
        attributes: ['id', 'comment', 'createdAt'],
        include: [{
          model: Tweet,
          attributes: ['id', 'description', 'createdAt', 'replyCounts', 'likeCounts', [
            Sequelize.literal(`EXISTS (
            SELECT * FROM Likes
            WHERE UserId = ${req.params.id} AND TweetId = Tweet.id
          )`
            ), 'isLiked']],
          include: [{
            model: User,
            attributes: ['id', 'name', 'account', 'avatar']
          }]
        }],
        order: [['createdAt', 'DESC']]
      })
      const replies = results.map(reply => {
        reply.createdAt = moment(reply.createdAt).format('YYYY-MM-DD hh:mm:ss a')
        reply.Tweet.createdAt = moment(reply.Tweet.createdAt).format('YYYY-MM-DD hh:mm:ss a')
        reply.Tweet.isLiked = reply.Tweet.isLiked ? true : false
        return reply
      })
      return res.json(replies)
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      const results = await Tweet.findAll({
        raw: true,
        nest: true,
        where: { UserId: req.params.id },
        attributes: ['id', 'description', 'replyCounts', 'likeCounts', 'createdAt'],
        include: [{
          model: User,
          attributes: ['id', 'name', 'account', 'avatar']
        }],
        order: [['createdAt', 'DESC']]
      })
      const tweets = results.map(tweet => ({
        ...tweet,
        createdAt: moment(tweet.createdAt).format('YYYY-MM-DD hh:mm:ss a')
      }))
      return res.json(tweets)
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  getFollowings: async (req, res, next) => {
    try {
      const results = await Followship.findAll({
        raw: true,
        nest: true,
        where: { followerId: req.params.id },
        include: [{
          model: User, as: 'Following', attributes: ['id', 'name', 'account', 'avatar', 'introduction']
        }],
        order: [['createdAt', 'DESC']]
      })
      const followships = results.map(followship => ({
        ...followship,
        isFollowed: req.user.Followings.map(f => f.id).includes(followship.Following.id)
      }))
      return res.json(followships)
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  getFollowers: async (req, res, next) => {
    try {
      const results = await Followship.findAll({
        raw: true,
        nest: true,
        where: { followingId: req.params.id },
        include: [{
          model: User, as: 'Follower', attributes: ['id', 'name', 'account', 'avatar', 'introduction']
        }],
        order: [['createdAt', 'DESC']]
      })
      const followships = results.map(followship => ({
        ...followship,
        isFollowed: req.user.Followings.map(f => f.id).includes(followship.Follower.id)
      }))
      return res.json(followships)
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  putUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id)
      const { name, introduction } = req.body
      const { files } = req
      if (!name) {
        return res.json({ status: 'error', message: '名稱不可空白！' })
      }
      if (files) {
        let avatar = undefined
        let cover = undefined
        // 上傳頭像
        if (files.avatar) {
          avatar = await imgurUpload(files.avatar[0])
        }
        // 上傳封面
        if (files.cover) {
          cover = await imgurUpload(files.cover[0])
        }
        // update 使用者資料
        await user.update({
          name, introduction,
          avatar: avatar ? avatar.data.link : user.avatar,
          cover: cover ? cover.data.link : user.cover
        })
        return res.json({ status: 'success', message: '個人資料修改成功' })
      } else { // 未上傳檔案
        // update 使用者資料
        await user.update({ name, introduction })
        return res.json({ status: 'success', message: '個人資料修改成功' })
      }
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  editUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id)
      const { name, account, email, password, checkPassword } = req.body
      // 確認所有欄位
      if (!name || !account || !email || !password || !checkPassword) {
        return res.json({ status: 'error', message: '所有欄位皆為必填！' })
      }
      // 確認沒有相同帳號的使用者
      let sameUser = await User.findOne({ where: { account } })
      if (sameUser && sameUser.dataValues.id !== user.dataValues.id) {
        return res.json({ status: 'error', message: '此帳號已存在！' })
      }
      // 確認沒有相同 email 的使用者
      sameUser = await User.findOne({ where: { email } })
      if (sameUser && sameUser.dataValues.id !== user.dataValues.id) {
        return res.json({ status: 'error', message: '此 email 已存在！' })
      }
      // 確認密碼相同
      if (password !== checkPassword) {
        return res.json({ status: 'error', message: '密碼與確認密碼不符！' })
      }
      await user.update({
        name, account, email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
      })
      return res.json({ status: 'success', message: '個人設定修改成功' })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  getCurrentUser: async (req, res, next) => {
    try {
      const { id, name, account, email, role,
        avatar, cover, introduction, followingCounts, followerCounts } = req.user
      return res.json({
        id, name, account, email, role,
        avatar, followingCounts, followerCounts,
        cover, introduction,
        Followers: req.user.Followers, Followings: req.user.Followings
      })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  removeCover: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id)
      await user.update({ cover: null })
      return res.json({ status: 'success', message: '個人封面已刪除' })
    } catch (err) {
      console.log(err)
      next(err)
    }
  }
}

module.exports = userController
