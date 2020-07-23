const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJWT = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy
const moment = require('moment')

const db = require('../models')
const { User, Tweet, Reply, Like } = db

const userController = {
  register: (req, res) => {
    const { account, name, email, password, passwordConfirm } = req.body
    const errors = []
    if (!account && !name && !email && !password && !passwordConfirm) {
      errors.push({ status: 'error', message: 'all columns are empty' })
    } else if (!account) {
      errors.push({ status: 'error', message: 'account is empty' })
    } else if (!name) {
      errors.push({ status: 'error', message: 'name is empty' })
    } else if (!email) {
      errors.push({ status: 'error', message: 'email is empty' })
    } else if (!password) {
      errors.push({ status: 'error', message: 'password is empty' })
    } else if (!passwordConfirm) {
      errors.push({ status: 'error', message: 'passwordConfirm is empty' })
    } else if (password !== passwordConfirm) {
      errors.push({ status: 'error', message: 'password or passwordConfirm is incorrect' })
    }
    if (errors.length) return res.json(...errors);

    User.findOne({ where: { account } })
      .then(userOwnedAccount => {
        if (userOwnedAccount) {
          return res.json({ status: 'error', message: 'this account is registered' })
        }
        User.findOne({ where: { email } })
          .then(userOwnedEmail => {
            if (userOwnedEmail) {
              return res.json({ status: 'error', message: 'this email is registered' })
            }
            return User.create({
              account,
              name,
              email,
              password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
              role: 'user'
            })
          })
          .then(() => res.json({ status: 'success', message: 'register successfully' }))
          .catch(err => console.log(err))
      }).catch(err => console.log(err))
  },

  login: (req, res) => {
    // check input
    const { account, password } = req.body
    const errors = []
    if (!account && !password) {
      errors.push({ status: 'error', message: 'all columns are empty' })
    } else if (!account) {
      errors.push({ status: 'error', message: 'account is empty' })
    } else if (!password) {
      errors.push({ status: 'error', message: 'password is empty' })
    }
    if (errors.length) return res.json(...errors);

    // check user login info
    User.findOne({ where: { account } })
      .then(user => {
        if (!user) return res.json({ status: 'error', message: `can not find user "${user}"` })
        if (!bcrypt.compareSync(password, user.password)) {
          return res.json({ status: 'error', message: 'account or password is incorrect' })
        }

        const payload = { id: user.id }
        const token = jwt.sign(payload, process.env.JWT_SECRET)
        return res.json({
          status: 'success',
          message: 'ok',
          token,
          user: {
            id: user.id,
            account: user.account,
            name: user.name,
            email: user.email,
            role: user.role
          }
        })
      })
  },

  getUser: (req, res) => {
    return User.findByPk(req.params.id, {
      order: [
        [{ model: Tweet }, 'createdAt', 'DESC'],
        [{ model: Reply }, 'createdAt', 'DESC'],
        [{ model: Like }, 'createdAt', 'DESC'],
      ],
      include: [
        { model: Tweet, include: [Like, Reply] },
        { model: Reply, include: [Tweet] },
        { model: Like, include: [Tweet] },
      ]
    }).then(user => {
      return res.json({
        user: user,
        tweetCounts: user.Tweets.length,
      })
    })
  },

  putUser: (req, res) => {
    const { account, name, email, password, passwordConfirm, avatar, introduction, cover } = req.body
    const { id, editPage } = req.params
    //check page
    if (req.user.id === Number(id) && editPage === 'account') {
      //check user
      User.findByPk(id)
        .then(user => {
          if (!user) return res.json({ status: "error", "message": "user does not exist" })
          if (user) {
            // user update account and email
            if (account !== user.account && email !== user.email) {
              //check account and email are not duplicated
              return User.findOne({ where: { account } })
                .then(userAccount => {
                  if (userAccount) return res.json({ status: 'error', message: `account "${account}" is registered` })
                  return User.findOne({ where: { email } })
                    .then(userEmail => {
                      if (userEmail) return res.json({ status: 'error', message: `"email ${email}" is registered` })
                    })
                    .then(() => {
                      // user does not update password
                      if (!password && !passwordConfirm) {
                        return user.update({
                          account: account || user.account,
                          name: name || user.name,
                          email: email || user.email,
                        })
                      }
                      // user update password                      
                      if (password !== passwordConfirm) return res.json({ status: 'error', message: 'password or passwordConfirm is incorrect' })
                      return user.update({
                        account: account || user.account,
                        name: name || user.name,
                        email: email || user.email,
                        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
                      })
                    })
                    .then(() => res.json({ status: 'success', message: 'user account updated successfully', }))
                    .catch(err => console.log(err))
                }).catch(err => console.log(err))
            }
            // user update account
            if (account !== user.account && email === user.email) {
              //check account is not duplicated
              return User.findOne({ where: { account } })
                .then(userAccount => {
                  if (userAccount) return res.json({ status: 'error', message: `account "${account}" is registered` })
                })
                .then(() => {
                  // user does not update password
                  if (!password && !passwordConfirm) {
                    return user.update({
                      account,
                      name: name || user.name
                    })
                  }
                  // user update password                      
                  if (password !== passwordConfirm) return res.json({ status: 'error', message: 'password or passwordConfirm is incorrect' })
                  return user.update({
                    account,
                    name: name || user.name,
                    password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
                  })
                })
                .then(() => res.json({ status: 'success', message: 'user account updated successfully', }))
                .catch(err => console.log(err))
            }

            // user update email
            if (account === user.account && email !== user.email) {
              //check email is not duplicated
              return User.findOne({ where: { email } })
                .then(userEmail => {
                  if (userEmail) return res.json({ status: 'error', message: `email "${email}" is registered` })
                })
                .then(() => {
                  // user does not update password
                  if (!password && !passwordConfirm) {
                    return user.update({
                      email,
                      name: name || user.name
                    })
                  }
                  // user update password                      
                  if (password !== passwordConfirm) return res.json({ status: 'error', message: 'password or passwordConfirm is incorrect' })
                  return user.update({
                    email,
                    name: name || user.name,
                    password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
                  })
                })
                .then(() => res.json({ status: 'success', message: 'user account updated successfully', }))
                .catch(err => console.log(err))
            }

            if (account === user.account && email === user.email) {
              // user does not update password
              if (!password && !passwordConfirm) {
                return user.update({
                  name: name || user.name
                })
              }
              // user update password                      
              if (password !== passwordConfirm) return res.json({ status: 'error', message: 'password or passwordConfirm is incorrect' })
              return user.update({
                name: name || user.name,
                password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
              })
                .then(() => res.json({ status: 'success', message: 'user account updated successfully', }))
                .catch(err => console.log(err))
            }
          }
        }).catch(err => console.log(err))
    } else {
      return res.json({ status: "error", "message": "permission denied" })
    }

    if (req.user.id === Number(id) && editPage === 'profile') {
      User.findByPk(id)
        .then(user => {
          if (!user) return res.json({ status: "error", "message": "user does not exist" })
          if (!name) return res.json({ status: 'error', message: 'name is empty' })
          return user.update({
            name: name || user.name,
            avatar: avatar || user.avatar,
            introduction: introduction || user.introduction,
            cover: cover || user.cover
          }).then(() => res.json({ status: 'success', message: 'user profile updated successfully', }))
        }).catch(err => console.log(err))
    } else {
      return res.json({ status: "error", "message": "permission denied" })
    }
  }

}
module.exports = userController