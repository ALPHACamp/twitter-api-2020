const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const helpers = require('../_helpers')
const { User, Tweet, Reply, Like, Followship } = require('../models')
const { en_IND } = require('faker/lib/locales')
const e = require('connect-flash')

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
      //const message=[]
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
  getUser: async (req, res, next) => {
    try {
      const id = req.params.id
      const user = await User.findOne({
        where: { id:id},
        include: [
          Tweet,
          { model: User, as: 'Followers'},
          { model: User, as: 'Followings'}
        ]
      })
      if (!user || user.role === 'admin'){
        return res.status(404).json({
          status: 'error',
          message: '使用者不存在'
        })
      }
      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        account: user.account,
        avatar: user.avatar,
        introduction: user.introduction,
        cover: user.cover,
        role: user.role,
        tweetCount: user.Tweets.length,
        followerCount: user.Followers.length,
        followingCount: user.Followings.length,
        isFollowed: user.Followers.map(el => el.id).include(req.user.id)
      }
        return res.status(200).json(userData)
      }
        catch(error){
          next(error)
        }
    },
    
}

module.exports = userController
