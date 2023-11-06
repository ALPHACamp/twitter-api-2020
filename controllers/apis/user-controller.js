const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { User, Tweet, Reply, Like, Followship, sequelize } = require('../../models')
const { Op } = require("sequelize");

const userController = {
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.checkPassword) throw new Error('Passwords do not match!')
    User.findOne( { where: { [Op.or]: [{email: req.body.email} , {account: req.body.account}] } } )
    .then(user => {
        if(user===null) user=[]
          
          if (user.account===req.body.account) throw new Error('account 已重複註冊！')
          else if (user.email===req.body.email) throw new Error('email 已重複註冊！')
        

        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        account:req.body.account,
        name: req.body.name,
        email: req.body.email,
        role: 'user',
        password: hash
      }))
      .then((createdUser) => {
        createdUser.toJSON()
        delete createdUser.password
        return res.json({
          status: 'success',
          message: '註冊成功！',
          ...createdUser
        })
      })
      .catch(err => next(err))
  },
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' }) // 簽發 JWT，效期為 30 天
      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },
  getUser: (req, res, next) => {
    
  }

}
module.exports = userController