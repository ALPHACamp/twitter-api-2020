const Sequelize = require('sequelize')
const Op = Sequelize.Op

const db = require('../../models')
const User = db.User
const bcrypt = require('bcryptjs')
const helpers = require('../../_helpers');

const userController = {
  signUp: (req, res) => {
    // confirm password
    if (req.body.password !== req.body.checkPassword) {
      return res.json({ status: 'error', message: 'Inconsistent password' })
    } else {
      // confirm unique user
      User.findOne({
        where: {
          [Op.or]: [
            { email: req.body.email },
            { account: req.body.account }
          ]
        }
      }).then(user => {
        if (user) {
          if (user.email === req.body.email) {
            return res.json({ status: 'error', message: 'This email is already registered.' })
          }
          if (user.account === req.body.account) {
            return res.json({ status: 'error', message: 'This account is existed.' })
          }
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            account: req.body.account,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
            cover: req.body.cover,
            avatar: req.body.avatar
          }).then(user => {
            return res.status(200).json('Accept')
          })
        }
      })
        .catch(error => console.log(error))
    }
  },
  editUser: (req, res) => {
    User.findByPk(req.params.id)
      .then(user => {
        return res.json({ user })
      })
  },
  editUserProfile: (req, res) => {
    User.findByPk(req.params.id)
      .then(user => {
        return res.json({ name: user.name, introduction: user.introduction })
      })
  },
  putUser: (req, res) => {
    if (helpers.getUser(req).id !== Number(req.params.id)) {
      res.json({ status: 'error', message: "Cannot edit other's profile." })
      return res.redirect('back')
    }
    User.findByPk(req.params.id)
      .then(user => {
        user.update({
          account: req.body.account,
          name: req.body.name,
          email: req.body.email,
          introduction: req.body.introduction
        })
          .then((user) => {
            res.status(200).json('Accept')
            return res.redirect(`/users/${user.id}`)
          })
      })
      .catch(error => console.log(error))
  },
  logout: (req, res) => {
    res.json({ status: 'success', message: 'Logout successful.' })
    req.logout()
    res.redirect('/signin')
  }
}

module.exports = userController
