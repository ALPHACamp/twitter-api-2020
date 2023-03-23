const { Op } = require('sequelize')
const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, Followship } = db
const jwt = require('jsonwebtoken')
const helpers = require('../_helpers')

const userController = {
  signUp: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body

    if (password !== checkPassword) throw new Error('Password do not match!')

    User.findOne({ where: { [Op.or]: [{ account }, { email }] } })
      .then(user => {
        if (user) throw new Error('account or email already exists!')

        return bcrypt.hash(password, 10)
      })
      .then(hash => User.create({
        account,
        name,
        email,
        password: hash
      }))
      .then(() => res.json({
        status: 'success'
      }))
      .catch(err => next(err))
  },
  signIn: (req, res, next) => {
    try {
      const userData = helpers.getUser(req).toJSON()
      const authToken = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })

      res.json({
        status: 'success',
        authToken,
        data: {
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },
  addFollowing: (req, res, next) => {
    const user = helpers.getUser(req)
    const followerId = user.id
    const followingId = Number(req.body.id)

    return Promise.all([
      User.findAll({
        raw: true,
        attributes: ['id']
      }),
      Followship.findOne({ where: { [Op.and]: [{ followerId }, { followingId }] } })
    ])
      .then(([users, followship]) => {
        if (!users.some(user => user.id === followingId)) throw new Error("User didn't exist!")
        if (followship) throw new Error('You have followed this user!')
        if (followerId === followingId) throw new Error("You can't follow yourself!")

        return Followship.create({
          followerId,
          followingId
        })
          .then(followship => { res.json({ followship }) })
      })
      .catch(err => next(err))
  },
  removeFollowing: (req, res, next) => {
    const user = helpers.getUser(req)
    const followerId = user.id
    const followingId = Number(req.params.followingId)

    return Promise.all([
      User.findAll({
        raw: true,
        attributes: ['id']
      }),
      Followship.findOne({ where: { [Op.and]: [{ followerId }, { followingId }] } })
    ])
      .then(([users, followship]) => {
        if (!users.some(user => user.id === followingId)) throw new Error("User didn't exist!")
        if (!followship) throw new Error("You didn't follow this user!")

        return followship.destroy()
      })
      .then(followship => {
        res.json({ followship })
      })
      .catch(err => next(err))
  }
}

module.exports = userController
