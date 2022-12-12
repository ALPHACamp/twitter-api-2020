const bcrypt = require('bcryptjs')
const { User } = require('../models')

const userController = {
  // delete later
  signUp: (req, res)=> {
    const { account, name, email, password, avatar, introduction, cover } = req.body
    return bcrypt.hash(req.body.password, 10)
      .then(hash => User.create({
        account,
        name,
        email,
        password: hash,
        avatar, introduction,
        cover
      }))
      .then(() => {
        res.json() //
      })
  },
  putUser: (req, res, next) => {
    const { account, name, email, password, avatar, introduction, cover } = req.body
    return User.findByPk(req.params.id)
      .then(user => {
        if (!user) 
      })

  }
}
module.exports = userController
