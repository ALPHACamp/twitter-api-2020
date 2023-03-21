const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { User, Tweet, Reply, Like, Followship } = require('../models')
const userController = {
  // 登入
  signIn: async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ status: 'error', message: 'Email and password are required' })
    }
    try {
      const user = await User.findOne({ where: { email } })
      if (!user) return res.status(404).json({ status: 'error', message: 'User does not exist' })
      if (user.role === 'admin') return res.status(404).json({ status: 'error', message: 'User does not exist' })
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: 'Incorrect password' })
      }
      const userData = user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET)
      return res.status(200).json({
        status: 'success',
        message: 'Successfully sign in',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },
  // 註冊
  signUp: async (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    if (!account || !name || !email || !password) {
      return res.status(400).json({ status: 'error', message: 'All fields are required' })
    }
    if (password.length < 5 || password.length > 12) {
      return res.status(400).json({ status: 'error', message: 'Password should be between 5-12' })
    }
    if (password !== checkPassword) {
      return res.status(400).json({ status: 'error', message: 'Check password do not match' })
    }
    if (name.length < 1 || name.length > 50) {
      return res.status(400).json({ status: 'error', message: 'Name should be less than 50' })
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ status: 'error', message: 'Invalid email address' })
    }
    try {
      const [userAccount, userEmail] = await Promise.all([
        User.findOne({ where: { account } }),
        User.findOne({ where: { email } })
      ])
      if (userAccount || userEmail) {
        return res.status(400).json({ status: 'error', message: 'Existing email or user account' })
      }
      const hash = await bcrypt.hash(password, 10)
      const newUser = await User.create({
        account,
        name,
        email,
        password: hash
      })
      const userData = newUser.toJSON()
      delete userData.password
      return res.status(200).json({
        status: 'success',
        message: 'Successfully sign up',
        data: { user: userData }
      })
    } catch (err) {
      next(err)
    }
  },
  getUser: async (req, res, next) => {
    const { id } = req.params
    try {
      const user = await User.findByPk(id, {
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] } // 可以排除敏感資料
      })
      if (!user || user.role === 'admin') return res.status(404).json({ status: 'error', message: 'User not found' })
      const userData = user.toJSON()
      delete userData.role
      return res.status(200).json(userData)
    } catch (err) { next(err) }
  },
  getUserTweets: async (req, res, next) => {
    const { id } = req.params
    try {
      const user = await User.findByPk(id)
      if (!user) { return res.status(404).json({ status: 'error', message: 'User not found' }) }
      const tweets = await Tweet.findAll({ raw: true, nest: true, order: [['createdAt', 'DESC']], where: { UserId: id } })
      if (!tweets) return res.status(404).json({ status: 'error', message: 'Tweets not found' })
      return res.status(200).json(tweets)
    } catch (err) { next(err) }
  },
  getUserReplies: async (req, res, next) => {
    const { id } = req.params
    try {
      const user = await User.findByPk(id)
      if (!user) { return res.status(404).json({ status: 'error', message: 'User not found' }) }
      const replies = await Reply.findAll({ raw: true, nest: true, order: [['createdAt', 'DESC']], where: { UserId: id } })
      if (!replies) return res.status(404).json({ status: 'error', message: 'Replies not found' })
      return res.status(200).json(replies)
    } catch (err) { next(err) }
  },
  getUserLikes: async (req, res, next) => {
    const { id } = req.params
    try {
      const user = await User.findByPk(id)
      if (!user) { return res.status(404).json({ status: 'error', message: 'User not found' }) }
      const likes = await Like.findAll({ raw: true, nest: true, order: [['createdAt', 'DESC']], where: { UserId: id } })
      return res.status(200).json(likes)
    } catch (err) { next(err) }
  },
  getUserFollowing: async (req, res, next) => {
    const { id } = req.params
    try {
      const user = await User.findByPk(id)
      if (!user) { return res.status(404).json({ status: 'error', message: 'User not found' }) }
      const userFollowings = await Followship.findAll({
        where: { followerId: id },
        include: [{ model: User, as: 'Followings' }],
        order: [['createdAt', 'DESC']],
        nest: true,
        raw: true
      })
      return res.status(200).json(userFollowings)
    } catch (err) { next(err) }
  },
  getUserFollower: async (req, res, next) => {
    const { id } = req.params
    try {
      const user = await User.findByPk(id)
      if (!user) { return res.status(404).json({ status: 'error', message: 'User not found' }) }
      const userFollowers = await Followship.findAll({
        where: { followingId: id },
        include: [{ model: User, as: 'Followers' }],
        order: [['createdAt', 'DESC']],
        nest: true,
        raw: true
      })
      return res.status(200).json(userFollowers)
    } catch (err) { next(err) }
  },
  putUser: async (req, res, next) => {
    const { id } = req.params
    const { name, introduction } = req.body
    const { avatar = null, cover = null } = req.files || {}
    if (name.length < 1 || name.length > 50) {
      return res.status(400).json({ status: 'error', message: 'Name should be less than 50' })
    }
    if (introduction.length > 160) return res.status(400).json({ status: 'error', message: 'introduction should be less than 160 characters' })
    try {
      const user = await User.findByPk(id)
      if (!user) return res.status(404).json({ status: 'error', message: 'User not found' })
      const filePaths = {
        updatedAvatar: avatar ? await imgurFileHandler(avatar[0]) : null,
        updatedCover: cover ? await imgurFileHandler(cover[0]) : null
      }
      const updatedUser = await user.update({
        name,
        avatar: filePaths.updatedAvatar || user.avatar,
        cover: filePaths.updatedCover || user.cover,
        introduction
      })
      return res.status(200).json({
        status: 'success',
        message: 'Successfully updated user',
        data: { user: updatedUser }
      })
    } catch (err) { next(err) }
  }
}
module.exports = userController
