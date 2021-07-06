const db = require('../../models')
const User = db.User
const bcrypt = require('bcrypt-nodejs')
const defaultLimit = 10

let userController = {
  getUsers: (req, res) => {
    const offset = req.query.offset || 0
    const limit = req.query.limit || defaultLimit
    const userId = 1 //before building JWT
    const order = [['followerNum', 'DESC']]
    const attributes = ['id', 'account', 'name', 'avatar', 'cover', 'tweetNum', 'likeNum', 'followingNum', 'followerNum', 'lastLoginAt']
    User.findAll({
      offset, limit, order, attributes,
      include: [{
        model: User,
        as: "Followers",
        attributes: ['id']
      }]
    }).then(users => {
      users = users.map(user => {
        user.dataValues.isFollowing = user.dataValues.Followers.some(follower => follower.id === userId)
        delete user.dataValues.Followers
        return user
      })
      return res.status(200).json({ Users: users })
    }).catch(err => {
      return res.status(500).json({ status: 'error', message: err })
    })
  },
  postUser: (req, res) => {
    const { name, account, email, password, checkPassword } = req.body
    if (!name || !account || !email || !password || !checkPassword) {
      return res.status(401).json({
        status: 'error', message: "Missing data."
      })
    }
    if (password !== checkPassword) {
      return res.status(401).json({
        status: 'error', message: "Password and confirm password doesn't match."
      })
    }
    User.findOne({ where: { account } }).then(user => {
      if (user) {
        return res.status(401).json({
          status: 'error', message: "Account was already used."
        })
      } else {
        User.findOne({ where: { email } }).then(user => {
          if (user) {
            return res.status(401).json({
              status: 'error', message: "Email was already used."
            })
          } else {
            User.create({
              name,
              account,
              email,
              password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
            })
              .then(user => {
                return res.status(200).json({
                  status: 'success', message: "Account successfully created."
                })
              })
          }
        })
      }
    }).catch(err => {
      return res.status(500).json({ status: 'error', message: err })
    })
  },
  getUser: (req, res) => {
    const id = req.params.id
    const userId = 1 //before building JWT
    const attributes = ['id', 'account', 'name', 'email', 'introduction', 'avatar', 'cover', 'tweetNum', 'likeNum', 'followingNum', 'followerNum', 'lastLoginAt']
    User.findByPk(id, {
      attributes,
      include: [{
        model: User,
        as: "Followers",
        attributes: ['id']
      }]
    }).then(user => {
      if (user) {
        user.dataValues.isFollowing = user.dataValues.Followers.some(follower => follower.id === userId)
        delete user.dataValues.Followers
        return res.json(user)
      }
      return res.status(404).json({ status: 'error', message: 'User not found.' })
    }).catch(err => {
      return res.status(500).json({ status: 'error', message: err })
    })
  }
}

module.exports = userController;