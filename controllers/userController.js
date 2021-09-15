const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fs = require('fs')

const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const { User, Tweet, Like, Sequelize, Reply } = require('../models')

const uploadImg = path => {
  return new Promise((resolve, reject) => {
    imgur.upload(path, (err, img) => {
      if (err) {
        return reject(err)
      }
      resolve(img)
    })
  })
}

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
    User.findByPk(req.params.id,{
      attributes: [
        'id', 'name', 'avatar', 'introduction', 'account', 'cover', 'role',
        [Sequelize.literal('COUNT(DISTINCT Tweets.id)'), 'tweetsCount'],
        [Sequelize.literal('COUNT(DISTINCT Followers.id)'), 'followersCount'],
        [Sequelize.literal('COUNT(DISTINCT Followings.id)'), 'followingsCount'] 
      ],
      include: [
        Tweet,
        { model: User, as: 'Followers' , attributes: []},
        { model: User, as: 'Followings' , attributes: []},
        { model: Like , attributes: []},
      ]
    })
    .then((user) => {
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
  },
  getUserTweets: (req, res) => {
    Promise.all([
      User.findByPk(req.params.id,{
      attributes: [
        'role',
      ]
    }),
    Tweet.findAll({
      where: { UserId : req.params.id },
      include: [
        { model: Reply },
        { model: Like },
        { model: User , attributes: ['id', 'name', 'avatar', 'account']},
      ]
    })
    ])  
    .then(([user, tweets]) => {
      //不可看到admin資料 或是空用戶
      if(user.role === 'admin' || !user){
        return res.status(403).json({
          'status': 'error',
          'message': '此用戶不存在'
        })
      }
      let tweetSet = tweets.map(tweet =>({
          'id': tweet.id,
          'description': tweet.description,
          'updatedAt': tweet.updatedAt,
          'replyCount': tweet.Replies.length,
          'likeCount': tweet.Likes.length,
          'user': tweet.User
      }))
      return res.status(200).json(tweetSet)
    })
    .catch(err => {console.log(err)})    
  },
  putUser: async(req, res) => {
    //前台：修改使用者個人資料(avatar、cover、name、introduction)
    const { name, introduction } = req.body
    //上傳至imgur
    
    const { files } = req
    //1.確定是登入者
    if(Number(req.params.id) !== req.user.id){
      return res.status(403).json({ status: 'error', message: "並非該用戶，無訪問權限！"})
    }
    // 確定introduction(160)、name(50)
    if(name && name.length > 50){
      return res.status(422).json({ status: 'error', message: "名稱字數超出上限！"})
    }
    if(introduction && introduction.length > 160){
      return res.status(422).json({ status: 'error', message: "自我介紹字數超出上限！"})
    }
    let images = {}
    if(files){
      imgur.setClientID(IMGUR_CLIENT_ID)
      for (const key in files) {
          images[key] = await uploadImg(files[key][0].path)
        }
    }
    let user = await User.findByPk(req.params.id)
    await user.update({
        name,
        introduction,
        avatar: images.avatar ? images.avatar.data.link : user.avatar,
        cover: images.cover ? images.cover.data.link : user.cover
      })
    return res.status(200).json({
        status: 'success',
        message: 'Update successfully'
    })

  }
}

module.exports = userController