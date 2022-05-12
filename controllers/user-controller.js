const bcrypt = require('bcryptjs')
const { User } = require('../models')
const helpers = require('../_helpers')

const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy


const userController = {
  signIn: (req, res, next) => {
    const { account, password } = req.body
    if (!account || !password) throw new Error('Account and Password are required!')

    User.findOne({ where: { account } })
      .then(user => {
        if (!user) throw new Error('帳號不存在！')
        if (user.role === 'admin') throw new Error('帳號不存在！')
        if (!bcrypt.compareSync(password, user.password)) throw new Error('Password incorrect!')
        const userData = user.toJSON()
        delete userData.password
        const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
        return res.status(200).json({
          token,
          user: userData
        })
      })
      .catch(err => next(err))
  },

  signUp: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    if (password !== checkPassword) {
      throw new Error('密碼與確認密碼不符！')
    }

    // 確認資料裡面沒有相同的 email，若有，就建立一個 Error 物件並拋出
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('此 Email 已被註冊！')
        return bcrypt.hash(password, 10) // 前面加 return
      })
      .then(hash =>
        User.create({
          // 上面錯誤狀況都沒發生，就把使用者的資料寫入資料庫
          account,
          name,
          email,
          password: hash,
          role: ''
        })
      )
      .then(newUser => {
        const user = newUser.toJSON()
        delete user.password
        return res.status(200).json(user)
      })
      .catch(err => next(err))
  },
  getUser: (req, res, next) => {
    const userId = Number(req.params.id)
    const reqUserId = helpers.getUser(req).id
    return User.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [
        { model: User, as: 'LikedTweets' },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
    .then (user => {
      if (!user) throw new Error ('Account does not exist!')
      if (user.role === 'admin') throw new Error ('Account does not exist!')
      user.dataValues.isFollowed = user.Followers.map(u => u.id).includes(reqUserId)
      return res.status(200).json(user)
    })
    .catch(err => next(err))
  }
}

module.exports = userController
