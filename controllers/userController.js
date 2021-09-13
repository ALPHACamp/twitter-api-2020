const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const { User, Tweet, Like, Sequelize } = require('../models')

let userController = {
  userLogin: (req, res) => {
    const { email, password } = req.body

    // 檢查必要資料
    if (!email.trim() || !password.trim()) {
      return res.json({ status: 'error', message: "required fields didn't exist" })
    }

   // 檢查 user 是否存在與密碼是否正確
    User.findOne({ where: { email } }).then(user => {
      if (!user) return res.status(401).json({ status: 'error', message: 'no such user found' })
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: 'passwords did not match' })
      }
      // 簽發 token
      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.status(200).json({
        status: 'success',
        message: 'login successfully',
        token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin
        }
      })
    })
  },
  register: (req, res) => {
    //TODO 使用者註冊，account、email必須唯一
    const { account, email, password, confirmPassword } = req.body
    // 檢查必要資料
    if (!account.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      return res.status(422).json({ status: 'error', message: "欄位不可空白" }) //case1
    }
    if(password !== confirmPassword) return res.status(401).json({ status: 'error', message: "兩次密碼輸入不同！" }) //case2
    Promise.all([User.findOne({ where: { email }}), User.findOne({ where: {account}})])
      .then(([userHasEmail, userHasAccount]) => {
        if(userHasEmail && userHasAccount) return res.status(409).json({ status: 'error', message: "email 和 account 已重覆註冊！" }) //TODO 問前端case5
        if(userHasEmail) return res.status(409).json({ status: 'error', message: "email 已重覆註冊！" }) //case3
        if(userHasAccount) return res.status(409).json({ status: 'error', message: "account 已重覆註冊！" }) //case4
        User.create({
          account,
          email,
          password : bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
          role: 'user',
          avatar: 'https://i.imgur.com/PxViWBK.png',
          cover: 'https://images.unsplash.com/photo-1575905283836-a741eb65a192?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1377&q=80'
        })
        .then(user => {
          return res.json({ status: 'success', message: '成功註冊帳號！'})
        })
      })
      .catch(err => {console.log(err)})
  },
  getUser: (req, res) => {
    //TODO: 不確定需要甚麼資料
    User.findByPk(req.params.id,{
      attributes: [
        'id', 'name', 'avatar', 'introduction', 'account', 'cover'
      ],
      include: [
        Tweet,
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
        { model: Like }
      ]
    })
    .then(user => {
      //不可看到admin資料 或是空用戶
      if(user.role === 'admin' || !user){
        return res.status(403).json({
          'status': 'error',
          'message': '此用戶不存在'
        })
      }
      return res.status(200).json(user)
    })
    .catch(err => {console.log(err)})

  }
}

module.exports = userController