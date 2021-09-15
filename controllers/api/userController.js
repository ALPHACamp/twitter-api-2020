const Sequelize = require('sequelize');
const Op = Sequelize.Op;

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
        }
        else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            account: req.body.account,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
            cover: req.body.cover,
            avatar: req.body.avatar
          }).then(user => {
            return res.json({ status: 'success', message: 'Registration successful' })
          })
        }
      })
        .catch(error => console.log(error))
    }
  },
  logout: (req, res) => {
    req.flash('success_message', 'Logout successful')
    req.logout()
    res.redirect('/signin')
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
  putEditUser: async (req, res) => {
    User.findByPk(req.params.id)
      .then(user => {
        // console.log('req.params.id:', req.params.id)
        // console.log('req.user.id:', req.user.id)
        // if (helpers.getUser(req).id !== Number(req.params.id)) {
        //   res.json({ status: 'error', message: "Cannot edit other's profile." })
        //   return res.redirect('back')
        // }
        if (!req.body.account || !req.body.name || !req.body.email) {
          res.json({ status: 'error', message: 'Account, name, and email must have value.' })
          return res.redirect('back')
        }
        try {
          return User.findByPk(req.params.id)
            .then(user => {
              user.update({
                account: req.body.account,
                name: req.body.name,
                email: req.body.email
              })
                .then((user) => {
                  res.json({ status: 'success', message: 'Acccount update successful.' })
                  return res.redirect(`/users/${user.id}`)
                })
            })
        } catch (err) {
          console.log(error)
        }
      })
  },
  putUserProfile: async (req, res) => {
    User.findByPk(req.params.id)
      .then(user => {
        // console.log('req.params.id:', req.params.id)
        // console.log('req.user.id:', req.user.id)
        // if (helpers.getUser(req).id !== Number(req.params.id)) {
        //   res.json({ status: 'error', message: "Cannot edit other's profile." })
        //   return res.redirect('back')
        // }
        if (!req.body.name) {
          res.json({ status: 'error', message: 'Name must have value.' })
          return res.redirect('back')
        }
        try {
          return User.findByPk(req.params.id)
            .then(user => {
              user.update({
                name: req.body.name,
                introduction: req.body.introduction
              })
                .then((user) => {
                  res.json({ status: 'success', message: 'Profile update successful.' })
                  return res.redirect(`/users/${user.id}/profile`)
                })
            })
        } catch (err) {
          console.log(error)
        }
      })
  }
}

module.exports = userController
