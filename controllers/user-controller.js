const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { User } = require('../models')
const { getUser } = require('../_helpers')

const userController = {
  signIn: (req, res, next) => {
    const { account, password } = req.body
    // make sure all fields are filled
    if (!account || !password) throw new Error('帳號和密碼為必填！')

    User.findOne({ where: { account } })
      .then((user) => {
        if (!user) throw new Error('帳號不存在！')
        if (user.role === 'admin') throw new Error('帳號不存在！')
        if (!bcrypt.compareSync(password, user.password))
          throw new Error('密碼錯誤！')
        const userData = user.toJSON()
        delete userData.password
        const token = jwt.sign(userData, process.env.JWT_SECRET, {
          expiresIn: '30d',
        })
        return res.status(200).json({
          token,
          user: userData,
        })
      })
      .catch((err) => next(err))
  },

  signUp: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    if (password !== checkPassword) throw new Error('密碼與確認密碼不符！')
    if (!account || !name || !email || !password || !checkPassword)
      throw new Error('此欄位不可空白！')

    // 確認資料裡面沒有相同的 email，若有，就建立一個 Error 物件並拋出
    User.findAll({
      $or: [{ where: { email } }, { where: { account } }],
    })
      .then((users) => {
        if (users.some((u) => u.email === email))
          throw new Error('此 Email 已被註冊！')
        if (users.some((u) => u.account === account))
          throw new Error('此 Account 已被註冊！')
        if (name.length > 50 || account.length > 50)
          throw new Error('字數上限為 50 個字！')

        return bcrypt.hash(password, 10)
      })
      .then((hash) => {
        return User.create({
          account,
          name,
          email,
          password: hash,
          role: '',
        })
      })
      .then((newUser) => {
        const userData = newUser.toJSON()
        delete userData.password
        const token = jwt.sign(userData, process.env.JWT_SECRET, {
          expiresIn: '30d',
        })
        return res.status(200).json({
          token,
          user: userData,
        })
      })
      .catch((err) => next(err))
  },

  getUser: (req, res, next) => {
    const userId = Number(req.params.id)
    const reqUserId = getUser(req).id
    return User.findByPk(userId, {
      include: [
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
      ],
    })
      .then((user) => {
        if (!user || user.role === 'admin') throw new Error('帳號不存在！')
        user.dataValues.isFollowed = user.Followers.map((u) => u.id).includes(
          reqUserId
        )
        return res.status(200).json(user)
      })
      .catch((err) => next(err))
  },

  getCurrentUser: (req, res, next) => {
    const reqUser = getUser(req)
    const result = reqUser.toJSON()
    delete result.password
    return res.status(200).json(result)
  },
}


module.exports = userController
