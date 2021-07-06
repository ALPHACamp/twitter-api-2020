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
      return res.json({ Users: users })
    }).catch(err => {
      return res.json({ status: 'error', message: err })
    })
  },
  postUser: (req, res) => {
    const { name, account, email, password, checkPassword } = req.body
    if (!name || !account || !email || !password || !checkPassword) {
      return res.json({
        status: 'error', message: "Missing data."
      })
    }
    if (password !== checkPassword) {
      return res.json({
        status: 'error', message: "Password and confirm password doesn't match."
      })
    }
    User.findOne({ where: { account } }).then(user => {
      if (user) {
        return res.json({
          status: 'error', message: "Account was already used."
        })
      } else {
        User.findOne({ where: { email } }).then(user => {
          if (user) {
            return res.json({
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
                return res.json({
                  status: 'success', message: "Account successfully created."
                })
              })
          }
        })
      }
    })
  }
}

module.exports = userController;