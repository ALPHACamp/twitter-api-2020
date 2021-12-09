const bcrypt = require('bcryptjs')
const db = require('../models')
const helpers = require('../_helpers')
const User = db.User
const Tweet = db.Tweet
const Like = db.Like
const Reply = db.Reply
const Followship = db.Followship

// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy
const imgur = require('imgur')
const tweet = require('../models/tweet')

const userController = {
  signIn: (req, res) => {
    const { account, password } = req.body
    if (!account || !password) {
      return res.json({ status: 'error', message: '請輸入必填欄位!' })
    }
    User.findOne({ where: { account } }).then(user => {
      if (!user) {
        return res.status(401).json({ status: 'error', message: '帳號不存在!' })
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: '帳號不存在!' })
      }
      if (user.role === "admin") {
        return res.json({ status: 'error', message: '帳號不存在!' })
      }
      // issue token
      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
      // console.log('token = jwt.sign with', process.env.JWT_SECRET) // OK
      return res.json({
        status: 'success',
        message: 'OK',
        token: token,
        user: {
          id: user.id, name: user.name, account: user.account, email: user.email, role: user.role
        }
      })
    })
  },
  adminSignIn: (req, res) => {
    if (!req.body.account || !req.body.password) {
      return res.json({ status: 'error', message: '請輸入必填欄位' })
    }
    // 比對User資料庫、比對密碼
    let { account, password } = req.body
    User.findOne({ where: { account } }).then(user => {
      if (!user) {
        return res.status(401).json({ status: 'error', message: '' })
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: '' })
      }
      if (user.role !== "admin") {
        return res.status(401).json({ status: 'error', message: '帳號不存在' })
      }
      // issue token
      var payload = { id: user.id }
      var token = jwt.sign(payload, process.env.JWT_SECRET)
      // console.log('token = jwt.sign with', process.env.JWT_SECRET) // OK
      return res.json({
        status: 'success',
        message: 'OK',
        token: token,
        user: {
          id: user.id, name: user.name, account: user.account, email: user.email, role: user.role
        }
      })
    })
  },
  signUp: (req, res) => {
    const { account, name, email, password, checkPassword } = req.body

    // 確認欄位是否皆有填寫
    if (!account || !name || !email || !password || !checkPassword) {
      return res.json({ status: 'error', message: '請輸入必填欄位!' })
    }
    // 確認密碼
    if (password !== checkPassword) {
      return res.json({ status: 'error', message: '確認密碼輸入錯誤!' })
    }

    // 確認email或account是否重複
    User.findOne({
      where: {
        $or: [
          { email },
          { account }
        ]
      }
    }).then(user => {
      if (user) {
        if (user.email === email) {
          return res.json({ status: 'error', message: 'email已重覆註冊！' })
        }
        if (user.account === account) {
          return res.json({ status: 'error', message: 'account已重覆註冊！' })
        }
      } else {
        User.create({
          account, email, name,
          password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
        })
        return res.json({ status: 'success', message: '成功註冊!' })
      }
    })
  },
  getUserAccountSetting: (req, res) => {
    const userId = helpers.getUser(req).id
    User.findByPk(userId)
      .then(user => {
        return res.json({
          user: {
            name: user.name,
            account: user.account,
            email: user.email
          }
        })
      })
  },
  putUserAccountSetting: (req, res) => {
    const userId = helpers.getUser(req).id
    const { account, name, email, password, checkPassword } = req.body

    // 確認欄位是否皆有填寫
    if (!account || !name || !email || !password || !checkPassword) {
      return res.json({ status: 'error', message: '請輸入必填欄位！' })
    }
    // 確認密碼
    if (password !== checkPassword) {
      return res.json({ status: 'error', message: '確認密碼輸入錯誤!' })
    }

    // 確認email或account是否重複
    User.findOne({
      where: {
        $or: [
          { email },
          { account }
        ],
        $not: [
          { id: userId }
        ],
      }
    }).then(user => {
      if (user) {
        if (user.email === email) {
          return res.json({ status: 'error', message: 'email已重覆註冊！' })
        }
        if (user.account === account) {
          return res.json({ status: 'error', message: 'account已重覆註冊！' })
        }
      } else {
        return User.findByPk(userId).then(user => {
          user.update({
            account, email, name,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
          })
          return res.json({ status: 'success', message: '成功編輯' })
        })
      }
    })
  },
  getCurrentUser: (req, res) => {
    const userId = helpers.getUser(req).id
    return User.findByPk(userId).then(user => {
      return res.json(
        { user }
      )
    })
  },
  getUserProfile: (req, res) => {
    const UserId = req.params.id
    return User.findByPk(UserId, {
      attributes: ['id', 'name', 'account', 'avatar', 'cover', 'introduction'],
      include: [
        { model: User, as: 'Followers', attributes: ['id', 'name', 'account', 'avatar'] },
        { model: User, as: 'Followings', attributes: ['id', 'name', 'account', 'avatar'] },
        { model: Tweet, attributes: ['id'] }
      ]
    }).then(user => {
      user = user.toJSON()
      user.FollowerCount = user.Followers.length //跟隨者人數
      user.FollowingCount = user.Followings.length //跟隨中人數
      user.isFollowed = req.user.Followings.map(d => d.id).includes(user.id)
      user.TweetCount = user.Tweets.length
      delete user.Followers
      delete user.Followings
      delete user.Tweets
      return res.json(user)
    }
    )
  },
  getUserInfo: (req, res) => {
    const userId = helpers.getUser(req).id
    return User.findByPk(userId)
      .then(user => {
        return res.json({
          user: {
            name: user.name,
            introduction: user.introduction,
            avatar: user.avatar,
            cover: user.cover
          }
        })
      })
  },
  editUserInfo: (req, res) => {
    const userId = helpers.getUser(req).id
    User.findByPk(userId)
      .then(user => {
        const { name, introduction, avatar, cover } = req.body
        const { files } = req.body
        imgur.setClientId(process.env.IMGUR_CLIENT_ID)
        if (!name) {
          return res.json({ status: 'error', message: 'name為必填欄位' })
        }
        if (files) {
          if (files.cover) {
            // 如果cover更新, 就上傳
            const cover = imgur.uploadFile(files.cover[0].path)
            req.body.cover = cover.link
          }
          if (files.avatar) {
            // 如果avatar更新, 就上傳
            const avatar = imgur.uploadFile(files.avatar[0].path)
            req.body.avatar = avatar.link
          }
        }
        else {
          return User.findByPk(userId).then(user => {
            user.update({
              name, introduction, avatar, cover
            })
            return res.json({ status: 'success', message: '成功編輯' })
          })
        }
      })
  },
  //取得特定瀏覽人次id
  getOneLikes: (req, res) => {
    const UserId = req.params.id
    return Like.findAll({
      where: { UserId },
      // attributes: ['id', 'createdAt'] , // 加了結果只剩一筆
      order: [['createdAt', 'DESC']],
      include: {
        model: Tweet, attributes: ['id', 'description', 'createdAt'], include: [
          { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
          { model: User, as: 'LikedUsers', attributes: ['id'] },
          { model: User, as: 'RepliedUsers', attributes: ['id'] }
        ]
      }
    })
      .then((tweets) => {
        tweets = tweets.map(tweet => ({
          ...tweet.dataValues,
          repliedCount: tweet.Tweet.RepliedUsers.length,
          likedCount: tweet.Tweet.LikedUsers.length,
          isLiked: req.user.LikedTweets.map(d => d.id).includes(tweet.Tweet.id)
        }))
        tweets.forEach(tweet => {
          delete tweet.Tweet.dataValues.RepliedUsers
          delete tweet.Tweet.dataValues.LikedUsers
        })
        return res.json(tweets)
      })
  },
  getOneRepliedTweets: (req, res) => {
    const UserId = req.params.id
    return Reply.findAll({
      where: { UserId },
      order: [['createdAt', 'DESC']],
      include: {
        model: Tweet, attributes: ['id', 'description', 'createdAt'], include: [
          { model: User, attributes: ['id', 'name', 'account'] }]
      }
    })
      .then(replies => {
        return res.json(replies)
      })
  },
  getOneTweets: (req, res) => {
    const UserId = req.params.id
    return Tweet.findAll({
      where: { UserId },
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, as: 'LikedUsers', attributes: ['id'] },
        { model: User, as: 'RepliedUsers', attributes: ['id'] }]
    })
      .then(tweets => {
        tweets = tweets.map(tweet => ({
          ...tweet.dataValues,
          repliedCount: tweet.RepliedUsers.length,
          likedCount: tweet.LikedUsers.length,
          isLiked: req.user.LikedTweets.map(d => d.id).includes(tweet.id)
        }))
        tweets.forEach(tweet => {
          delete tweet.RepliedUsers
          delete tweet.LikedUsers
        })
        return res.json(tweets)
      })
  },
  getOneFollowers: (req, res) => {
    const UserId = req.params.id
    return User.findByPk(UserId, {
      attributes: ['id'],
      include: { model: User, as: "Followers", attributes: ['id', 'name', 'account', 'introduction', 'avatar'] },
      order: [[User.associations.Followers, Followship, 'createdAt', 'DESC']],
    }).then(users => {
      users = users.Followers
      users = users.map((user) => ({
        ...user.dataValues,
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
      }))
      return res.json(users)
    })
  },
  getOneFollowings: (req, res) => {
    const UserId = req.params.id
    return User.findByPk(UserId, {
      attributes: ['id'],
      include: { model: User, as: "Followings", attributes: ['id', 'name', 'account', 'introduction', 'avatar'] },
      order: [[User.associations.Followings, Followship, 'createdAt', 'DESC']],
    }).then(users => {
      users = users.Followings
      users = users.map((user) => ({
        ...user.dataValues,
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
      }))
      return res.json(users)
    })
  },
}



module.exports = userController
