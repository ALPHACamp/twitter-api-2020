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
  userLogin: async (req, res, next) => {
    try {
      const { email, password } = req.body
      // 檢查必要資料
      if (!email.trim() || !password.trim()) {
        return res.json({ status: 'error', message: "Required fields didn't exist" })
      }

      const user = await User.findOne({ where: { email } })

      if (!user) return res.status(401).json({ status: 'error', message: 'No such user found' })

      if(user.role === 'admin') return res.status(401).json({ status: 'error', message: 'No such user found, admin can not login.' })

      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: 'Passwords did not match' })
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
    }catch (err) {
      next(err)
    }
  },
  register: async (req, res, next) => {
    try {
      //使用者註冊，account、email必須唯一
      const { account, name, email, password, checkPassword } = req.body
      // 檢查必要資料
      const regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

      if (!account || !name || !email || !password) {
        return res.status(422).json({ status: 'error', message: "欄位不可空白" })
      }

      if (!account.trim() || !name.trim() || !email.trim() || !password.trim()) {
        return res.status(422).json({ status: 'error', message: "欄位不可空白" })
      }

      if (!regex.test(email)) {
        return res.status(401).json({ status: 'error', message: "不符合信箱格式！" })
      }

      if (password !== checkPassword) {
        return res.status(401).json({ status: 'error', message: "兩次密碼輸入不同！" })
      }
      //name：平常顯示的暱稱，如 Ellen Lee，上限 50 字
      if (name && name.length > 50) {
        return res.status(422).json({ status: 'error', message: "名稱字數超出上限50字！" })
      }
      if (account && account.length > 50) {
        return res.status(422).json({ status: 'error', message: "名稱字數超出上限50字！" })
      }
      const userHasEmail = await User.findOne({ where: { email } })
      const userHasAccount = await User.findOne({ where: { account } })
      if (userHasEmail && userHasAccount) return res.status(409).json({ status: 'error', message: "email 和 account 已重覆註冊！" })
      if (userHasEmail) return res.status(409).json({ status: 'error', message: "email 已重覆註冊！" })
      if (userHasAccount) return res.status(409).json({ status: 'error', message: "account 已重覆註冊！" })

      User.create({
        account,
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
        role: 'user',
        avatar: 'https://i.imgur.com/PxViWBK.png',
        cover: 'https://images.unsplash.com/photo-1575905283836-a741eb65a192?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1377&q=80'
      })
      return res.json({ status: 'success', message: '成功註冊帳號！' })
    }catch (err) {
      next(err)
    }
  },
  getUser: async (req, res, next) => {
    try {
      const userId = req.params.id
      const user = await User.findByPk(userId,{
        attributes: [
          'id', 'name', 'avatar', 'introduction', 'account', 'cover', 'role',
          [Sequelize.literal('COUNT(DISTINCT Tweets.id)'), 'tweetsCount'],
          [Sequelize.literal('COUNT(DISTINCT Followers.id)'), 'followersCount'],
          [Sequelize.literal('COUNT(DISTINCT Followings.id)'), 'followingsCount']
        ],
        include: [
          Tweet,
          { model: User, as: 'Followers', attributes: [] },
          { model: User, as: 'Followings', attributes: [] },
          { model: Like, attributes: [] },
        ]
      })      
      if(user.id === null){
        return res.status(403).json({
          'status': 'error',
          'message': '此用戶不存在'
        })
      }
      return res.status(200).json(user)
    }catch (err) {
      next(err)
    }
  },
  getUserTweets: async (req, res, next) => {
    try{
      const user = await User.findByPk(req.params.id, { attributes: ['role'] })
      if(!user){
        return res.status(403).json({
          'status': 'error',
          'message': '此用戶不存在'
        })
      }
      const userTweets = await Tweet.findAll({
        where: { UserId: req.params.id },
        include: [
          { model: Reply },
          { model: Like },
          { model: User, attributes: ['id', 'name', 'avatar', 'account'] },
        ]
      }) 
      
      let tweetSet = userTweets.map(tweet => ({
        'id': tweet.id,
        'description': tweet.description,
        'updatedAt': tweet.updatedAt,
        'replyCount': tweet.Replies.length,
        'likeCount': tweet.Likes.length,
        'user': tweet.User
      }))
      return res.status(200).json(tweetSet)      
    }catch (err) {
      next(err)
    }
  },
  putUser: async (req, res, next) => {
    try{
      //前台：修改使用者個人資料(avatar、cover、name、introduction)
      const { name, introduction } = req.body
      //上傳至imgur
      const { files } = req
      //1.確定是登入者
      if (Number(req.params.id) !== req.user.id) {
        return res.status(403).json({ status: 'error', message: "並非該用戶，無訪問權限！" })
      }
      // 確定introduction(160)、name(50)
      if (name && name.length > 50) {
        return res.status(422).json({ status: 'error', message: "名稱字數超出上限！" })
      }
      if (introduction && introduction.length > 160) {
        return res.status(422).json({ status: 'error', message: "自我介紹字數超出上限！" })
      }
      let images = {}
      if (files) {
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
    }catch (err) {
      next(err)
    }


  },
  putUserSetting: async (req, res, next) => {
    try {
      //修改使用者設定(修改使用者設定(account、name、email、password)，account、email必須唯一
      const { account, email, password, checkPassword } = req.body
      const regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      //1.確定是登入者
      if (req.user.id !== Number(req.params.id)) {
        return res.status(403).json({ status: 'error', message: "並非該用戶，無訪問權限！" })
      }

      // 檢查必要資料
      if (!account.trim() || !email.trim() || !password.trim() || !checkPassword.trim()) {
        return res.status(422).json({ status: 'error', message: "欄位不可空白" }) 
      }
      if (!regex.test(email)) {
        return res.status(401).json({ status: 'error', message: "不符合信箱格式！" })
      }
      if (account && account.length > 50) {
        return res.status(422).json({ status: 'error', message: "名稱字數超出上限50字！" })
      }
      if (password !== checkPassword) return res.status(401).json({ status: 'error', message: "兩次密碼輸入不同！" })

      const userHasEmail = User.findOne({ where: { email } })
      const userHasAccount = User.findOne({ where: { account } })
      if (userHasEmail && userHasAccount) return res.status(409).json({ status: 'error', message: "email 和 account 已有註冊！" })
      if (userHasEmail) return res.status(409).json({ status: 'error', message: "email 已有註冊，請重新輸入！" }) 
      if (userHasAccount) return res.status(409).json({ status: 'error', message: "account 已有註冊，請重新輸入！" }) 
      
      const user = await User.findByPk(req.params.id)
      user.update({ account, email, password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null) })    
      return res.json({ status: 'success', message: '已成功修正！' })
    }catch (err) {
      next(err)
    }
  },
  getTweets: async(req, res, next) => {
    try{
      const user = await User.findByPk(req.user.id,{
        include: [
          { model: User, as: 'Followers', attributes: ['id'] },
        ]
      })
      let followers = user.Followers.map(user => { return user.id }) //array去裝followers
      const tweet = await Tweet.findAll({ where: { UserId: followers } })
      return res.status(200).json({ tweet })
    }catch (err) {
      next(err)
    }
  },
  getTopUsers: async (req, res, next) => {
    try {
      const user = await User.findAll({
        include: [{ model: User, as: 'Followers' }],
        attributes: [
          'id', 'name', 'avatar', 'account',
          [Sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id)'), 'followersCount'
          ]
        ],
        order: [[Sequelize.literal('followersCount'), 'DESC']],
        limit: 10,
        raw: true,
        nest: true
      })
      return res.status(200).json(user)
    } catch (err) {
      next(err)
    }
  },
  getFollowers: async (req, res, next) => {
    try {
      const { id } = req.params
      let user = await User.findByPk(id, {
        include: [{ model: User, as: 'Followers' }],
        order: [[Sequelize.literal('`Followers->Followship`.`createdAt`'), 'DESC']]
      })

      if (!user) {
        return res.status(422).json({
          status: 'error',
          message: 'Can not find this user'
        })
      }
      Followers = user.Followers.map(i => ({
        followerId: i.id,
        name: i.name,
        avatar: i.avatar,
        account: i.account
      }))
      return res.status(200).json(Followers)
    } catch (err) {
      next(err)
      console.log(err)
    }
  },
  getFollowings: async (req, res, next) => {
    try {
      const { id } = req.params
      let user = await User.findByPk(id, {
        include: [{ model: User, as: 'Followings' }],
        order: [[Sequelize.literal('`Followings->Followship`.`createdAt`'), 'DESC']]
      })

      if (!user) {
        return res.status(422).json({
          status: 'error',
          message: 'Can not find this user'
        })
      }

      Followings = user.Followings.map(i => ({
        followingId: i.id,
        name: i.name,
        avatar: i.avatar,
        account: i.account
      }))
      return res.status(200).json(Followings)
    } catch (err) {
      next(err)
    }
  },
  getLikedTweets: async (req, res, next) => {
    try {
      const { id } = req.params
      let user = await User.findByPk(id, {
        include: [{ model: Like, include: [{ model: Tweet }] }],
        order: [[Sequelize.literal('createdAt'), 'DESC']]
      })

      if (!user) {
        return res.status(422).json({
          status: 'error',
          message: 'Can not find this user'
        })
      }
      const likeTweets = user.Likes.map(i => ({
        TweetId: i.TweetId,
        UserId: i.UserId,
        Tweet: i.Tweet,
        createdAt: i.createdAt,
        updatedAt: i.updatedAt
      }))
      return res.status(200).json(likeTweets)
    } catch (err) {
      next(err)
    }
  },
  getUserReliedTweets: async (req, res) => {
    try{
      const UserId = req.params.id
      const user = await User.findByPk(UserId, { attributes: ['role'] })
      if(!user){
        return res.status(403).json({
          'status': 'error',
          'message': '此用戶不存在'
        })
      }
      const userTweetReply = await Reply.findAll({
        where: { UserId },
        attributes: [ 'TweetId', 'comment', 'updatedAt', 'createdAt' ],
        include: [
          { model: User, attributes: [ 'id', 'name', 'avatar', 'account'] },
          { model: Tweet, attributes: ['description'], include: { model: User, attributes: ['id', 'account'] } },
        ],
        order: [ ['createdAt', 'DESC'] ]
      })
      return res.json([...userTweetReply])
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController