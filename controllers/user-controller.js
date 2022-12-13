const bcrypt = require('bcryptjs')
const { User, Tweet } = require('../models')

const userController = {
  postUsers: (req, res, next) => {
    const { account, name, email, password, passwordCheck } = req.body
    if (!account || !name || !email || !password || !passwordCheck) throw Error('All field is required!', {}, Error.prototype.code = 402)
    if (password !== passwordCheck) throw Error('Passwords do not match!', {}, Error.prototype.code = 422)
    if (password.length < 8 && password.length > 12) throw Error('Password over!', {}, Error.prototype.code = 412)
    if (account.length > 50 || name.length > 50) throw Error('Name or account over!', {}, Error.prototype.code = 403)
    if (!email.match(/^\w+@\w+\.\w+$/i)) throw Error('Invalid email format!', {}, Error.prototype.code = 401)

    Promise.all([
      User.findOne({ where: { email } }),
      User.findOne({ where: { account } })
    ])
      .then(([userEmail, userAccount]) => {
        if (userEmail) throw new Error('Email already exists!', {}, Error.prototype.code = 408)
        if (userAccount) throw new Error('Account already exists!', {}, Error.prototype.code = 423)
        return bcrypt.hash(password, 10)
      })
      .then(hash => User.create({
        account,
        name,
        email,
        password: hash,
        cover: 'https://i.imgur.com/KNbtyGq.png'

      }))
      .then(user => {
        const dataPackage = {
          status: 200,
          data: user.get({ plain: true })
        }
        delete dataPackage.data.password
        res.json(dataPackage)
      })
      .catch(err => next(err))
  },
  getUser: (req, res, next) => {
    return Promise.all([
      User.findByPk(req.params.id),
      Tweet.findAndCountAll({
        where: { userId: req.params.id }
      })
    ])
      .then(([user, tweets]) => {
        if (!user) throw new Error('error')
        return User.create
      })

      (data => {
        res.json({ status: 'success', data })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const { account, name, email, password, avatar, introduction, cover } = req.body
    return User.findByPk(req.params.id)
      .then(user => {
        if (!user) throw new Error('not exist!')
        return user.update(
          account,
          name,
          email,
          password,
          avatar,
          introduction,
          cover
        )
      })
      .then(data => {
        res.json({ status: 'success', data })
      })
      .catch(err => next(err))
  }
}

module.exports = userController
