const { User, Tweet, Reply, Like, Followship } = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const helpers = require('../_helpers')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID


const userController = {

  signup: async (req, res, next) => {
    try {
      const { name, account, email, password, confirmPassword } = req.body
      if (!name || !account || !email || !password || !confirmPassword) return res.json({ status: 'error', message: '請填入所有欄位' })
      if (password !== confirmPassword) return res.json({ status: 'error', message: '密碼與確認密碼不符' })
      let user = await User.findOne({ where: { email } })
      if (user) return res.json({ status: 'error', message: `此信箱已註冊` })
      user = await User.findOne({ where: { account } })
      if (user) return res.json({ status: 'error', message: `此帳號已有人使用` })

      const salt = await bcrypt.genSalt(10)
      const hashPassword = await bcrypt.hash(password, salt)
      await User.create({
        account,
        name,
        email,
        password: hashPassword,
        role: 'user'
      })
      return res.json({ status: 'success', message: '註冊成功' })
    }
    catch (err) {
      next(err)
    }
  },
  signin: async (req, res, next) => {
    try {
      const { account, password } = req.body
      if (!account || !password) return res.json({ status: 'error', message: '請填入所有欄位' })

      const user = await User.findOne({ where: { account } })
      if (!user) return res.status(401).json({ status: 'error', message: '查無此使用者' })
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) return res.status(401).json({ status: 'error', message: '密碼輸入錯誤' })

      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.json({
        status: 'success',
        message: 'ok',
        token,
        user: {
          id: user.id, account: user.account, name: user.name, email: user.email, isAdmin: user.isAdmin
        }
      })
    }
    catch (err) {
      next(err)
    }
  },
  getUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id) || false
      if (!user) return res.json({ status: 'error', message: '使用者不存在' })
      return res.json(user)
      // return res.json({ key: 'test' })
    } catch (err) { next(err) }
  },
  getUserTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        where: { UserId: req.params.id },
        include: [User]
      })
      if (tweets.length === 0) {
        return res.json({ status: 'error', message: '使用者暫無貼文' })
      }
      return res.json(tweets)
    } catch (err) { next(err) }
  },
  getUserRepliedTweets: async (req, res, next) => {
    try {
      const replies = await Reply.findAll({
        where: { UserId: req.params.id },
        include: [Tweet]
      })
      const tweets = await replies.map(reply => reply.Tweet)
      if (tweets.length === 0) return res.json({ status: 'error', message: '沒有回覆的推文' })
      return res.json(replies)
    } catch (err) { next(err) }
  },
  getUserLike: async (req, res, next) => {
    try {
      let likes = await Like.findAll({
        include: [
          User,
          { model: Tweet, include: [User] }],
        where: { UserId: req.params.id }
      })
      return res.json(likes)
    } catch (err) { next(err) }
  },
  getUserFollowings: async (req, res, next) => {
    try {
      // const followsing = await Followship.findByPk(req.params.id)
      // const followings = user.Followings
      const followings = await Followship.findAll({
        where: { followerId: req.params.id },
        include: [User]
      })
      return res.json(followings)
    } catch (err) { next(err) }
  },
  getUserFollowers: async (req, res, next) => {
    try {
      const followers = await Followship.findAll({
        where: { followingId: req.params.id }
      })
      return res.json(followers)
    } catch (err) { next(err) }
  },
  putUser: async (req, res, next) => {
    try {
      let { name, email, password, account, bio } = req.body
      const avatar = req.files.avatar || false
      const cover = req.files.cover || false
      const user = await User.findByPk(req.params.id)
      if (avatar && !cover) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(avatar[0].path, (err, img) => {
          user.update({
            name: name || helpers.getUser(req).name,
            email: email || helpers.getUser(req).email,
            password: password || helpers.getUser(req).password,
            account: account || helpers.getUser(req).account,
            bio: bio || helpers.getUser(req).bio,
            avatar: avatar ? img.data.link : helpers.getUser(req).avatar,
            cover: cover ? img.data.link : helpers.getUser(req).cover,
          })
          return res.json([user, { status: 'success', message: '個人頭貼更新成功' }])
        })
      } else if (!avatar && cover) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(cover[0].path, (err, img) => {
          user.update({
            name: name || helpers.getUser(req).name,
            email: email || helpers.getUser(req).email,
            password: password || helpers.getUser(req).password,
            account: account || helpers.getUser(req).account,
            bio: bio || helpers.getUser(req).bio,
            avatar: avatar ? img.data.link : helpers.getUser(req).avatar,
            cover: cover ? img.data.link : helpers.getUser(req).cover,
          })
          return res.json([user, { status: 'success', message: '封面更新成功' }])
        })
      } else if (avatar && cover) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(avatar[0].path, (err, img) => {
          user.update({
            name: name || helpers.getUser(req).name,
            email: email || helpers.getUser(req).email,
            password: password || helpers.getUser(req).password,
            account: account || helpers.getUser(req).account,
            bio: bio || helpers.getUser(req).bio,
            avatar: avatar ? img.data.link : helpers.getUser(req).avatar,
            cover: cover ? img.data.link : helpers.getUser(req).cover,
          })
        })
        imgur.upload(cover[0].path, (err, img) => {
          user.update({
            name: name || helpers.getUser(req).name,
            email: email || helpers.getUser(req).email,
            password: password || helpers.getUser(req).password,
            account: account || helpers.getUser(req).account,
            bio: bio || helpers.getUser(req).bio,
            avatar: avatar ? img.data.link : helpers.getUser(req).avatar,
            cover: cover ? img.data.link : helpers.getUser(req).cover,
          })
        })
        return res.json([user, { status: 'success', message: '個人資訊更新成功' }])
      } else {
        user.update({
          name: name || helpers.getUser(req).name,
          email: email || helpers.getUser(req).email,
          password: password || helpers.getUser(req).password,
          account: account || helpers.getUser(req).account,
          bio: bio || helpers.getUser(req).bio,
          avatar: avatar ? img.data.link : helpers.getUser(req).avatar,
          cover: cover ? img.data.link : helpers.getUser(req).cover,
        })
        return res.json(user)
      }
    } catch (err) { next(err) }
  },
  // logout: (req, res) => {
  //   req.logout()
  //   res.json({ status: 'success', message: '成功登出' })
  //   return res.redirect('/api/users/signin')
  // },
}

module.exports = userController
