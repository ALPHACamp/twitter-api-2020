const jwt = require('jsonwebtoken')
const { User } = require('../models')
const bcrypt = require('bcryptjs')

const userServices = {
  signUp: (req, cb) => {
    if (req.body.password !== req.body.checkPassword) {
      throw new Error('密碼不一致 !')
    }

    const { account, name, email, password } = req.body

    if (name.length > 50) throw new Error('字數超出上限！')
    User.findOne({ where: { email }, raw: true })
      .then((user) => {
        if (!user) return bcrypt.hash(password, 10)

        if (user.account === account) throw new Error('account 已重複註冊！')
        if (user.email === email) throw new Error('email 已重複註冊！')
      })
      .then((hash) =>
        User.create({
          account,
          name,
          email,
          password: hash
        })
      )
      .then((newUser) => cb(null, { success: 'true' }))
      .catch((err) => cb(err))
  }
}

const userController = {
  signUp: (req, res, next) => {
    userServices.signUp(req, (err, data) => (err ? next(err) : res.json(data)))
  },
  signIn: (req, res, next) => {
    const { account, password } = req.body
    if (!account || !password) {
      throw new Error('account and password are required.')
    }

    User.findOne({ where: { account, role: 'user' }, raw: true })
      .then((user) => {
        if (!user) {
          throw new Error('帳號不存在！')
        }
        const isValidPassword = bcrypt.compareSync(password, user.password)

        if (!isValidPassword) {
          throw new Error('帳號不存在！')
        }

        const UserId = { id: user.id }
        const token = jwt.sign(UserId, process.env.JWT_SECRET, {
          expiresIn: '30d'
        })

        delete user.password
        return res.status(200).json({ success: true, token, user })
      })
      .catch((err) => next(err))
  },
  getUser: (req, res, next) => {
    const { id } = req.params
    User.findByPk(id, {
      include: [{ model: User, as: 'Followings' }]
    })
      .then((user) => {
        if (!user) throw new Error('使用者不存在 !')
        return res.status(200).json({
          id: user.id,
          Followings: user.Followings,
          role: user.role
        })
      })
      .catch((err) => next(err))
  },
  putUser: (req, res, next) => {
    const { account, name, email, introduction } = req.body
    const { id } = req.params

    let avatarFile = req.files.avatar
    let coverFile = req.files.cover
    if (!name) throw new Error('name 欄位為必填!')
    // 將 avatar 和 cover 資料取出

    if (!req.files.avatar) {
      avatarFile = [{ path: '' }]
    }

    if (!req.files.cover) {
      coverFile = [{ path: '' }]
    }

    return Promise.all([User.findByPk(id), avatarFile, coverFile])
      .then(([user, avatarFile, coverFile]) => {
        if (!user) throw new Error('使用者不存在!')

        return user.update({
          account,
          name,
          email,
          introduction,
          avatar: avatarFile[0].path || user.avatar,
          cover: coverFile[0].path || user.cover
        })
      })
      .then((updateUser) =>
        res.status(201).json({ success: true, data: updateUser })
      )
      .catch((err) => next(err))
  }
}

module.exports = userController
