const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs') // 教案 package.json 用 bcrypt-node.js，不管，我先用舊的 add-on
const { Followship, Like, User, Tweet } = require('../models')
const { getUser } = require('../helpers/auth-helpers')
// const { getUser } = require('../_helpers')

const userController = {
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password // 刪除 .password 這個 property
      // (下1) 發出 jwt token，要擺兩個引數，第一個，要包進去的資料，第二個，要放 secret key
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' }) // 30 天過期，可調
      res.json({ status: 'success', data: { token, user: userData } })
    } catch (err) {
      next(err)
    }
  },
  signUp: (req, res, next) => {
    // (下1) 測試檔不給過，先 comment，之後刪
    // if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')
    if (req.body.name.length > 50) throw new Error('name 字數大於 50')

    return Promise.all([
      User.findOne({ where: { email: req.body.email } }),
      User.findOne({ where: { account: req.body.account } })
    ])
      .then(([emailResult, accountResult]) => {
        if (emailResult && accountResult) throw new Error('email 與 account 都重複註冊！')
        if (emailResult) throw new Error('email 已重複註冊！')
        if (accountResult) throw new Error('account 已重複註冊！')
      })
    // User.findOne({
    //   where: {
    //     [Op.or]: [
    //       { email: req.body.email },
    //       { account: req.body.account }]
    //   }
    // })
    //   .then(user => {
    //     if (user) throw new Error('email 已重複註冊！')

    //     return bcrypt.hash(req.body.password, 10)
    //   })
      .then(() => bcrypt.hash(req.body.password, 10))
      .then(hash =>
        User.create({
          account: req.body.account,
          name: req.body.name,
          email: req.body.email,
          password: hash
        })
      )
      .then(createdUser => {
        const result = createdUser.toJSON()
        delete result.password // 避免不必要資料外洩
        res.status(200).json({ status: 'success', user: result })
      })
      .catch(err => next(err))
  },
  getUser: (req, res, next) => {
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        if (!user) return res.status(404).json({ message: 'Can not find this user.' })
        delete user.password
        // return res.status(200).json({ status: 'success', user })
        // 因為測試檔，所以物件格式不能像 (上1) 一樣加工，必須做成 (下1)
        return res.status(200).json(user)
      })
      .catch(err => next(err))
  },
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      // where: { userId: req.params.id },
      where: { UserId: req.params.id }, // 這是為了測試檔的嘗試
      raw: true,
      order: [['createdAt', 'DESC']]
    })
      .then(tweets => res.status(200).json(tweets))
      // .then(tweets => {
      //   console.log(tweets)
      //   return res.status(200).json(tweets)
      // })
      .catch(err => next(err))
  },
  addFollowing: (req, res, next) => {
    const userId = Number(req.query.id) // 目標使用者
    return User.findByPk(getUser(req).id) // 登入的使用者
      .then(user => {
        // if (!user || !userId) {
        //   return res.status(404).json({ status: 'error', message: 'Cannot find this user' })
        // }
        // if (user.id === userId) throw new Error('不能追蹤自己')
        return Followship.create({
          followerId: user.id,
          followingId: userId
        })
      })
      .then(followship => {
        // if (followship) return res.status(409).json({ status: 'error', message: 'you already followed this user.' })
        return res.status(200).json(followship)
      })
      .catch(err => next(err))
  },
  removeFollowing: (req, res, next) => {
    const { followingId } = req.params
    return User.findByPk(getUser(req).id)
      .then(user => {
        return Followship.findOne({
          where: {
            followerId: user.id,
            followingId
          }
        })
      })
      .then(followship => {
        followship.destroy()
        return res.status(200).json({ message: 'success', followship })
      })
      .catch(err => next(err))
  },
  // getFollowship: (req, res, next) => {

  // },
  addLike: (req, res, next) => {
    const tweetId = req.params.id
    return User.findOne(getUser(req).id)
      .then(user => {
        return Like.create({
          UserId: user.id,
          TweetId: tweetId
        })
      })
      .then(like => {
        return res.status(200).json({ message: 'success', like })
      })
      .catch(err => next(err))
  },
  removeLike: (req, res, next) => {
    const tweetId = req.params.id
    return User.findOne(getUser(req).id)
      .then(user => {
        return Like.findOne({
          where: {
            UserId: user.id,
            TweetId: tweetId
          }
        })
      })
      .then(like => {
        like.destroy()
        return res.status(200).json({ message: 'success', like })
      })
      .catch(err => next(err))
  }
}

module.exports = userController
