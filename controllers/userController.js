const db = require('../models')
const User = db.User

const bcrypt = require('bcryptjs')
const helpers = require('../_helpers.js')

// 引入驗證欄位
const { registerCheck } = require('../middleware/validator.js')

// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const userController = {
  // 前台登入
  logIn: async (req, res, next) => {
    try {
      const { email, password } = req.body
      // 檢查是否輸入帳號密碼
      if (!email || !password) {
        return res.json({
          status: 'error',
          message: 'All fields are required.',
        })
      }
      // 確認使用者資料
      const user = await User.findOne({ where: { email } })
      // 檢查前台登入權限
      if (user.role === 'admin') {
        return res.status(401).json({
          status: 'error',
          message:
            'Admin can only login to backend, please register a user account to login frontend',
        })
      }
      // 無此使用者
      if (!user) {
        return res
          .status(401)
          .json({ status: 'error', message: 'User does not exist.' })
      }
      // 檢查密碼是否正確
      if (!bcrypt.compareSync(password, user.password)) {
        return res
          .status(401)
          .json({ status: 'error', message: 'Incorrect password.' })
      }

      // 簽發 token
      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.json({
        status: 'success',
        message: 'Login successful.',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          account: user.account,
          introduction: user.introduction,
          role: user.role,
        },
      })
    } catch (err) {
      next(err)
    }
  },
  // 註冊
  register: async (req, res, next) => {
    try {
      const { name, account, email, password, checkPassword } = req.body
      // validation middleware
      const message = await registerCheck(req)
      if (message) {
        return res
          .status(422)
          .json({ status: 'error', message, userFilledForm: req.body })
      }
      // create user
      await User.create({
        name,
        account,
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
        role: 'user',
        avatar: 'https://i.ibb.co/y6FYGKT/user-256.jpg',
        cover: 'https://i.ibb.co/Y0VVPVY/hex-999999.jpg',
      })
      return res
        .status(200)
        .json({ status: 'success', message: 'Registration success.' })
    } catch (err) {
      next(err)
    }
  },
  // 取得登入中使用者
  getCurrentUser: async (req, res, next) => {
    try {
      const id = helpers.getUser(req).id
      const currentUser = await User.findByPk(id, {
        attributes: [
          'id',
          'name',
          'account',
          'avatar',
          'role',
          'cover',
          'followerCount',
          'followingCount',
          'tweetCount',
        ],
      })
      return res.status(200).json(currentUser)
    } catch (err) {
      next(err)
    }
  },
  // 取得特定使用者
  getUser: async (req, res, next) => {
    try {
      const id = req.params.user_id
      const loginUserId = helpers.getUser(req).id
      const user = await User.findByPk(id, {
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' },
        ],
        attributes: [
          'id',
          'name',
          'account',
          'avatar',
          'role',
          'cover',
          'followerCount',
          'followingCount',
          'tweetCount',
        ],
      })
      // 是否已追蹤此 user
      const isFollowed = await user.Followers.map((d) => d.id).includes(
        loginUserId
      )
      return res.status(200).json({ user, isFollowed })
    } catch (err) {
      next(err)
    }
  },
}

module.exports = userController
