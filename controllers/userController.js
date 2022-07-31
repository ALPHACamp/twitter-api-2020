const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const Followship = db.Followship
const bcrypt = require('bcryptjs')
// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const userController = {
  signIn: (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
      return res.json({ ststus: 'error', message: '請輸入 email 與密碼' })
    }

    User.findOne({ where: { email: email } })
      .then(user => {
        if (!user) {
          return res.status(401).json({ ststus: 'error', message: '此 email 尚未註冊' })
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return res.status(401).json({ ststus: 'error', message: '密碼錯誤' })
        }

        // 簽發token
        let payload = { id: user.id }
        let token = jwt.sign(payload, process.env.JWT_SECRET)
        // 回傳訊息、token、user data
        return res.json({
          status: 'success',
          message: '登入驗證成功',
          token: token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            account: user.account,
            avatar: user.avatar,
            introduction: user.introduction,
            role: user.role
          }
        })
      })
  },
  signUp: (req, res) => {
    const { account, name, email, password, checkPassword } = req.body

    if (!account || !name || !email || !password || !checkPassword) {
      return res.json({ status: 'error', message: 'account, name, email, password, checkPassword 均需填寫' })
    }

    if (password !== checkPassword) {
      return res.json({ status: 'error', message: 'password, checkPassword 不一致' })
    }

    User.findOne({ where: { email: email } })
      .then(user => {
        if (user) {
          return res.json({ status: 'error', message: 'email 已經註冊' })
        }
        User.create({
          account: account,
          name: name,
          email: email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
          role: 'user'
        })
          .then(user => {
            return res.json({ status: 'success', message: '' })
          })
      })
  },
  getUser: (req, res) => {
    User.findByPk(req.params.id)
      .then(user => {
        user = {
          account: user.account,
          avatar: user.avatar,
          id: user.id,
          email: user.email,
          introduction: user.introduction,
          name: user.name,
          role: user.role,
        }
        return res.json(user)
      })
  },
  getUserTweets: (req, res) => {
    const userId = req.params.id
    Tweet.findAll({ where: { UserId: userId }, raw: true, nest: true })
      .then(tweets => {
        return res.json(tweets)
      })
  },
  getUserRepliedTweets: (req, res) => {
    const userId = req.params.id
    Reply.findAll({ where: { UserId: userId }, raw: true, nest: true })
      .then(replies => {
        return res.json(replies)
      })
  },
  getUserLikes: (req, res) => {
    const userId = req.params.id
    Like.findAll({ where: { UserId: userId }, raw: true, nest: true })
      .then(likes => {
        return res.json(likes)
      })
  },
  getUserFollowings: (req, res) => {
    const userId = req.params.id
    // 可以通過測試的寫法，但感覺實際又用上會有問題
    return Followship.findAll({ where: { followerId: userId } })
      .then(followings => {
        return res.json(followings)
      })

    // 實際應用上比較可能出現的寫法，先保留
    User.findByPk(userId, { include: [{ model: Tweet, include: Reply }, { model: Reply, include: Tweet }, { model: User, as: 'Followings' }, { model: User, as: 'Followers' }] })
      .then(user => {
        return res.json(user.Followings)
      })
  },
  getUserFollowers: (req, res) => {
    const userId = req.params.id
    Followship.findAll({ where: { followingId: userId } })
      .then(followers => {
        return res.json(followers)
      })
  },
  putUser: (req, res) => {
    const { name, introduction, email, account, checkPassword } = req.body
    let { password } = req.body
    if (password !== checkPassword) {
      return res.json({ status: 'error', message: 'password, checkPassword 不一致' })
    }
    if (password) {
      password = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
    } else {
      password = ''
    }
    User.findByPk(req.params.id)
      .then(user => {
        user.update({
          name: name || user.name,
          introduction: introduction || user.introduction,
          email: email || user.email,
          account: account || user.account,
          password: password || user.password,
        })
          .then(user => {
            user = {
              account: user.account,
              avatar: user.avatar,
              id: user.id,
              email: user.email,
              introduction: user.introduction,
              name: user.name,
              role: user.role,
            }
            return res.json(user)
          })
      })
  }
}

module.exports = userController
