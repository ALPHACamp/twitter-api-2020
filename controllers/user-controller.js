const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { User, Like } = require('../models')
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
  }, //喜歡功能
  addLike: (req, res, next) => {
    const { TweetId } = req.params.id
    return Promise.all([
      Tweet.findByPk(TweetId),
      Like.findOne({
        where: {
          UserId: req.user.id,
          TweetId
        }
      })
    ])
      .then(([tweet, like]) => {
        if (!tweet) { return res.status(400).json({ status: 'error', message: "Tweet didn't exist!" }) }
        if (like) { return res.status(400).json({ status: 'error', message: 'You have liked this tweet!' }) }

        return Like.create({
          userId: req.user.id,
          TweetId
        })
      })
      .then(() => {
        return res.json({
          status: 'success',
          message: 'Successfully liked the tweet'
        })
      })
      .catch(err => next(err))
  },//移除喜歡功能
  removeLike: (req, res, next) => {
    return Like.findOne({
      where: {
        UserId: req.user.id,
        TweetId: req.params.id
      }
    })
      .then(like => {
        if (!like) { return res.status(400).json({ status: 'error', message: "You haven't liked this tweet" }) }

        return like.destroy()
      })
      .then(() => {
        return res.json({
          status: 'success',
          message: 'Successfully unliked the tweet'
        })
      })
      .catch(err => next(err))
  }
}
module.exports = userController
