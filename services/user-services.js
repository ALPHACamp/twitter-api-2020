const {
  User
} = require('../models')
const bcrypt = require('bcryptjs')

const userServices = {
  signUp: (req, cb) => {
    User.findOne({
        where: {
          email: req.body.email,
          account: req.body.account
        }
      })
      .then(([email, account]) => {
        if (email) throw new Error('Email already exists!')
        if (account) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        account: req.body.account,
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(user => {
        delete user.password
        return cb(null, user)
      })

      .catch(err => cb(err))
  },
  getUser: (req, res, next) => {
    const userId = Number(req.params.id)
    User.findByPk(userId, {
        attributes: {
          exclude: ['password']
        },
        include: [{
            model: User,
            as: 'Followers',
            attributes: {
              exclude: ['password']
            }
          },
          {
            model: User,
            as: 'Followings',
            attributes: {
              exclude: ['password']
            }
          }
        ]
      })
      .then(user => {
        if (!user) throw new Error('帳號不存在！')
        if (user.role === 'admin') throw new Error('帳號不存在！')
        return res.status(200).json(user)
      })
      .catch(err => next(err))
  }

}

module.exports = userServices