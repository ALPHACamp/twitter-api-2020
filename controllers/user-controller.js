const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const helpers = require('../_helpers')
const { User } = require('../models')

const userController = {
  signIn: (req, res, next) => {
    try {
      if (helpers.getUser(req) && helpers.getUser(req).role === 'admin') {
        return res.status(403).json({ status: 'error', message: "此帳號不存在!" })
      }
      
      const userData = helpers.getUser(req).toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        },
        message: '成功登入！'
      })
      
    } catch (err) {
      next(err)
    }
  },
  signUp: async (req, res, next) => {
    try{
      const { account, name, email, password, checkPassword } =req.body
      if (!account || !name || !email || !password || !checkPassword ){
        res.status(403).json({ status: 'error', message: '所有欄位都是必填' })
      }
      if (email && !validator.isEmail(email)){
         res.status(403).json({ status: 'error', message: '請輸入正確信箱地址' })
     }
      if (password !== checkPassword) {
        res.status(403).json({ status: 'error', message: '密碼與確認密碼不相符' })
      }
      if (name && !validator.isByteLength(name, { min: 0, max: 50 })) {
         res.status(403).json({ status: 'error', message: '名稱長度不可超過50字' })
      }
      if (account && !validator.isByteLength(account, { min: 0, max: 15 })) {
          res.status(403).json({ status: 'error', message: '帳號長度不可超過15字' })
      }

      const [enterAccount, enterEmail] = await Promise.all([User.findOne({ where: { account } }), User.findOne({ where: { email} })])

      if(enterAccount){
         res.status(403).json({ status: 'error', message: '此帳號已註冊過！' })
      }
      if(enterEmail){
         res.status(403).json({ status: 'error', message: '此信箱已註冊過！' })
      }
      
      await User.create({
        account,
        name,
        email,
        role: 'user',
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
  getCurrentUser: (req, res, next) => {

    return res.status(200).json({
      id: req.user.id,
      name: req.user.name,
      account: req.user.account,
      email: req.user.email,
      avatar: req.user.avatar,
      role: req.user.role,
      cover: req.user.cover,
      introduction: req.user.introduction
    })
  },
  editCurrentUser: async (req,res,next) =>{
    try{
      const userID = req.user.id
      const id = req.params.id
      const{ account, name, email, password, checkPassword }= req.body
      const{ account:currentAccount, email:currentEmail }= req.user
      
      if(userID !== Number(id)) {
        return res.status(401).json({status:'error',message:'無法編輯其他使用者'})
      }
      if (!account || !name || !email || !password || !checkPassword) {
        res.status(403).json({ status: 'error', message: '所有欄位都是必填' })
      }
      if (email && !validator.isEmail(email)) {
        res.status(403).json({ status: 'error', message: '請輸入正確信箱地址' })
      }
      if (password !== checkPassword) {
        res.status(403).json({ status: 'error', message: '密碼與確認密碼不相符' })
      }
      if (name && !validator.isByteLength(name, { min: 0, max: 50 })) {
        res.status(403).json({ status: 'error', message: '名稱長度不可超過50字' })
      }
      if (account && !validator.isByteLength(account, { min: 0, max: 15 })) {
        res.status(403).json({ status: 'error', message: '帳號長度不可超過15字' })
      }
      if (account !== currentAccount) {
        const userAccount = await User.findOne({ where:account})
        if(userAccount){
          res.status(403).json({ status: 'error', message: '此帳號已有人使用！' })
        }
      }
      if(email !== currentEmail) { 
        const userEmail = await User.findOne({ where:email })
        if(userEmail){
          res.status(403).json({ status: 'error', message: '此信箱已有人使用！' })
        }
      }
      await User.update({ 
        account,
        name,
        email,
        password: bcrypt.hashSync(
          password,
          bcrypt.genSaltSync(10),
          null
        )
      })
      return res.status(200).json({
        status: 'success',
        message: '帳號更新成功！'
      })
    } catch (err) {
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
