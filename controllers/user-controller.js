const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const { User } = require('../models')

const userController = {
  signIn: (req, res, next) => {
    try {
      if (req.user && req.user.role === 'admin') {
        return res.status(403).json({ status: 'error', message: "This account didn't exist!" })
      }

      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
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
  signUp: async (req, res, next) => {
    try{
      const { account,name,email,password,confirmPassword} =req.body
      const errors = []
      if (!account || !name || !email || !password || !confirmPassword ){
        errors.push({message:'所有欄位都是必填'})
      }
      if (email && !validator.isEmail(email)){
       errors.push({ message: '請輸入正確信箱地址'}) 
     }
      if(password && !validator.isByteLength(password,{min:8,max:12})){
        errors.push({ message: '密碼長度須介於8到12位數' }) 
      }
      if (password !== confirmPassword) {
        errors.push({ message: '密碼與確認密碼不相符' })
      }
      if (name && !validator.isByteLength(name, { min: 0, max: 50 })) {
        errors.push({ message: '名稱長度不可超過50字' })
      }
      if (account && !validator.isByteLength(account, { min: 0, max: 15 })) {
        errors.push({ message: '帳號長度不可超過15字' })
      }
      if(errors.length >0) return {errors}

      const [enterAccount, enterEmail] = await Promise.all([User.findOne({ where: { account } }), User.findOne({ where: { email} })])
      const message=[]
      if(enterAccount){
        message.push('此帳號已註冊過！')
      }
      if(enterEmail){
        message.push('此信箱已註冊過！')
      }
      if(message.length >0) return {errors}
      
      await User.create({
        account,
        name,
        email,
        password:bcrypt.hashSync(
          password,
          bcrypt.genSaltSync(10),
          null
        )
      })
      return res.status(200).json({
        status:'success',
        message:'註冊成功請登入！'
      })
    }
      catch(err){
        console.log(err)
    }
  },
  getUser: (req, res, next) => {
    User.findOne({ 
      account: "root",
      raw: true
   })
    .then(user => console.log(user))
    .catch(err => next(err))
  }
}

module.exports = userController
