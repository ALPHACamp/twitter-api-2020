const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User } = require('../models')
const { getUser } = require('../_helpers')
const { imgurFileHandler } = require('../_helpers')

const userService = {
  signIn: (req, cb) => {
    const { account, password } = req.body
    if (!account || !password) throw new Error('account and password are required!')

    return User.findOne({
      where: { account }
    })
      .then(user => {
        if (!user) throw new Error('User not exist!')
        if (!bcrypt.compareSync(password, user.password)) throw new Error('password incorrect!')
        const userData = user.toJSON()
        delete userData.password
        const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
        return cb(null, {
          token,
          user: userData
        })
      })
      .catch(err => cb(err))
  },
  signUp: (req, cb) => {
    const { account, name, email, password, checkPassword } = req.body
    if (password !== checkPassword) throw new Error('Passwords do not match!')

    return User.findAll({
      $or: [
        { where: { account } },
        { where: { email } },
        { where: { name } }
      ]
    })
      .then(users => {
        if (users.some(u => u.email === email)) throw new Error('Email already exists!')
        if (users.some(u => u.account === account)) throw new Error('Account already exists!')
        if (users.some(u => u.name === name)) throw new Error('Name already exists!')

        return bcrypt.hash(password, 10)
      })
      .then(hash => {
        return User.create({
          account,
          password: hash,
          name,
          email,
          role: ''
        })
      })
      .then(newUser => {
        const user = newUser.toJSON()
        delete user.password
        return cb(null, user)
      })
      .catch(err => cb(err))
  },
  getUser: (req, cb) => {
    const userId = Number(req.params.id)
    User.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [
        { model: User, as: 'Followers', attributes: { exclude: ['password'] } },
        { model: User, as: 'Followings', attributes: { exclude: ['password'] } }
      ]
    })
      .then(user => {
        if (!user) throw new Error('User not exits!')
        if (user.role === 'admin') throw new Error('User not exits!')
        user.dataValues.isFollowed = (user.Followers.some(u => u.id === req.user.id))
        return cb(null, user)
      })
      .catch(err => cb(err))
  },
  putUserSetting: (req, cb) => {
    const { account, name, email, password, checkPassword } = req.body
    if (password !== checkPassword) throw new Error('Passwords do not match!')
    if (!account || !name || !email) throw new Error('Account, name and email are required!')
    if (getUser(req).id !== Number(req.params.id)) throw new Error('permission denied')
    return Promise.all([
      User.findAll({
        where: {
          $or: [
            { account },
            { email }
          ]
        },
        raw: true,
        nest: true
      }),
      User.findByPk(Number(req.params.id)),
      bcrypt.hash(password, 10)
    ])
      .then(([checkUsers, user, hash]) => {
        if (checkUsers.some(u => u.email === email)) throw new Error('email is registered')
        if (checkUsers.some(u => u.account === account)) throw new Error('account is registered')
        return user.update({
          account,
          name,
          email,
          password: hash
        })
      })
      .then(updatedUser => cb(null, { user: updatedUser }))
      .catch(err => cb(err))
  },
  putUser: (req, cb) => {
    const getUserId = Number(req.params.id)
    const { name, introduction } = req.body
    if (!name) throw new Error('name is required!')
    if (getUser(req).id !== getUserId) throw new Error('permission denied')
    const { files } = req
    console.log(req.files)
    return Promise.all([
      User.findByPk(getUserId),
      imgurFileHandler(files.avatar),
      imgurFileHandler(files.cover)
    ])
      .then(([user, avatarPath, coverPath]) => {
        if (!user) throw new Error('user not exist!')
        return user.update({
          name,
          introduction,
          avatar: avatarPath || user.avatar,
          cover: coverPath || user.cover
        })
      })
      .then(user => cb(null, user))
      .catch(err => cb(err))
  }
}

module.exports = userService


