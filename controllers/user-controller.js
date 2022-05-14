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
      .then(user => {
        if (!user) throw new Error('帳號不存在！')
        if (user.role === 'admin') throw new Error('帳號不存在！')
        if (!bcrypt.compareSync(password, user.password)) { throw new Error('密碼錯誤！') }
        const userData = user.toJSON()
        delete userData.password
        const token = jwt.sign(userData, process.env.JWT_SECRET, {
          expiresIn: '30d'
        })
        return res.status(200).json({
          token,
          user: userData
        })
      })
      .catch(err => next(err))
  },

  signUp: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    if (password !== checkPassword) throw new Error('密碼與確認密碼不符！')
    if (!account || !name || !email || !password || !checkPassword) { throw new Error('此欄位不可空白！') }

    // 確認資料裡面沒有相同的 email，若有，就建立一個 Error 物件並拋出
    User.findAll({
      $or: [{ where: { email } }, { where: { account } }]
    })
      .then((users) => {
        if (users.some((u) => u.email === email))
          throw new Error('此 Email 已被註冊！')
        if (users.some((u) => u.account === account))
          throw new Error('此帳號已被註冊！')
        if (name.length > 50 || account.length > 50)
          throw new Error('字數上限為 50 個字！')

        return bcrypt.hash(password, 10)
      })
      .then(hash => {
        return User.create({
          account,
          name,
          email,
          password: hash,
          role: ''
        })
      })
      .then(newUser => {
        const userData = newUser.toJSON()
        delete userData.password
        const token = jwt.sign(userData, process.env.JWT_SECRET, {
          expiresIn: '30d'
        })
        return res.status(200).json({
          token,
          user: userData
        })
      })
      .catch(err => next(err))
  },

  getUser: (req, res, next) => {
    const userId = Number(req.params.id)
    const reqUserId = getUser(req).id
    return User.findByPk(userId, {
      include: [
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
      .then(user => {
        if (!user || user.role === 'admin') throw new Error('帳號不存在！')
        user.dataValues.isFollowed = user.Followers.map(u => u.id).includes(
          reqUserId
        )
        return res.status(200).json(user)
      })
      .catch(err => next(err))
  },

  getCurrentUser: (req, res) => {
    const reqUserId = getUser(req).id
    const options = {
      attributes: ['id', 'account', 'name', 'email', 'avatar', 'role'],
    }
    
    User.findByPk(reqUserId, options)
      .then((user) => {
        return res.status(200).json(user)
      })
      .catch((err) => next(err))
  },

  getTopUsers: (req, res, next) => {
    const userId = Number(req.user.id)
    return User.findAll({
      include: { model: User, as: 'Followers' },
      attributes: ['id', 'account', 'name', 'avatar', 'createdAt'],
      where: { role: '' }
    })
      .then(users => {
        const result = users
          .map(user => ({
            ...user.toJSON(),
            followerCount: user.Followers.length,
            isFollowed: req.user.Followings.some(f => f.id === user.id),
            owner: Number(user.id) !== userId
          }))
          .sort((a, b) => b.followedCount - a.followedCount || b.createdAt - a.createdAt)
          .slice(0, 10)

        result.forEach(r => {
          delete r.Followers
        })

        res.status(200).json(result)
      })
      .catch(err => next(err))
  },

  putUserSetting: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    const userId = Number(req.params.id)
    const reqUserId = getUser(req).id
    // check if user is the current user
    if (userId !== reqUserId) throw new Error('Permission denied')
    // check password
    if (password !== checkPassword) throw new Error('密碼與確認密碼不符！')
    // check account
    if (!account || !name || !email)
      throw new Error('帳號、名稱和 email 欄位不可空白！')
    if (name.length > 50 || account.length > 50)
      throw new Error('字數上限為 50 個字！')

    return Promise.all([
      User.findAll({ $or: [{ where: { email } }, { where: { account } }] }),
      User.findByPk(userId),
      bcrypt.hash(password, 10),
    ])
      .then(([checkUsers, user, hash]) => {
        if (!user) throw new Error('帳號不存在！')
        if (checkUsers.some((u) => u.email === email && u.id !== reqUserId))
          throw new Error('此 Email 已被註冊！')
        if (checkUsers.some((u) => u.account === account && u.id !== reqUserId))
          throw new Error('此帳號已被註冊！')
        return user.update({
          account,
          name,
          email,
          password: hash,
        })
      })
      .then((updatedUser) => res.status(200).json({ user: updatedUser }))
      .catch((err) => next(err))
  },

  putUser: (req, res) => {
    const { account, name, email, password, checkPassword } = req.body
    const userId = Number(req.params.id)
    const reqUserId = getUser(req).id
    const { files } = req

    // check if user is the current user
    if (userId !== reqUserId) throw new Error('Permission denied')
    // check password
    if (password !== checkPassword) throw new Error('密碼與確認密碼不符！')
    // check account
    if (!account || !name || !email)
      throw new Error('帳號、名稱和 email 欄位不可空白！')
    if (name.length > 50 || account.length > 50)
      throw new Error('字數上限為 50 個字！')

      return User.findByPk(userId)
      .then(user => {
        if (!user) throw new Error('帳號不存在！')
        return User.update({
          name,
          introduction,
          avatar: avatar ? avatar : user.avatar,
          cover: cover ? cover : user.cover
        })
      })
      .then(updatedUser => res.status(200).json({ user: updatedUser }))
      .catch((err) => next(err))
  }

}

module.exports = userController
