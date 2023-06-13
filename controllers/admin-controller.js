const adminServices = require('../services/admin-service')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { User } = require('../models')

const adminController = {
  signIn: async (req, res, next) => {
    const { account, password } = req.body
    if (!account || !password) { throw new Error('Account and password are required') }
    return User.findOne({ where: { account }}).then((user)=>{
      if (!user) throw new Error('Admin not exists!')
      if (user.role === 'user') throw new Error('Admin not exists')
      if (!bcrypt.compareSync(password, user.password)) { throw new Error('Password incorrect') }
        const adminData = user.toJSON()
        delete adminData.password
        const token = jwt.sign(adminData, process.env.JWT_SECRET, {
          expiresIn: '30d'
        })
        return res.status(200).json({
          status: 'success',
          message: 'Login successful',
          data: {
            token,
            admin: adminData
          }
        })
      })
      .catch((err) => next(err))
  },
  getTweets: (req, res, next) =>{
    adminServices.getTweets(req, (err, data) => err ? next(err) : res.json(data))
  },
  getUsers: (req, res, next) =>{
    adminServices.getUsers(req, (err, data) => err ? next(err) : res.json(data.users))
  },
  getTweet: (req, res, next) =>{
    adminServices.getTweet(req, (err, data) => err ? next(err) : res.json(data))
  },
  deleteTweet: (req, res, next) =>{
    adminServices.deleteTweet(req, (err, data) => err ? next(err) : res.json(data))
  },
}  

module.exports = adminController