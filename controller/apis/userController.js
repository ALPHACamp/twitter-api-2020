const db = require('../../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like
const helper = require('../../_helpers')
const bcrypt = require('bcryptjs')

// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const like = require('../../models/like')
const { sequelize } = require('../../models')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const userController = {
  signIn: (req, res) => {
    // 檢查必要資料
    if (!req.body.email || !req.body.password) {
      return res.json({
        status: 'error',
        message: "required fields didn't exist"
      })
    }
    User.findOne({ where: { email: req.body.email } }).then(user => {
      if (!user)
        return res
          .status(401)
          .json({ status: 'error', message: 'user is not exist.' })
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res
          .status(401)
          .json({ status: 'error', message: 'email or password incorrect.' })
      }
      // 簽發 token
      var payload = { id: user.id }
      var token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.json({
        status: 200,
        message: 'pass',
        token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar
        }
      })
    })
  },

  signUp: async (req, res, cb) => {
    if (req.body.checkPassword !== req.body.password) {
      return res.json({ status: 'error', message: '兩次密碼輸入不相同！' })
    } else {
      try {
        const user = await User.findOne({ where: { email: req.body.email } })
        if (user) {
          return res.json({ status: 'error', message: '信箱重複！' })
        }
      } catch (err) {
        console.log(err)
      }
    }
    try {
      await User.create({
        account: req.body.account,
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(
          req.body.password,
          bcrypt.genSaltSync(10),
          null
        )
      })
      return res.json({ status: 'success', message: '成功註冊帳號！' })
    } catch (err) {
      console.log(err)
    }
  },
  getUser: async (req, res, cb) => {
    try {
      const userProfile = await User.findByPk(req.params.id, {
        raw: true,
        nest: true
      })
      return res.json({
        status: 'success',
        message: '',
        ...userProfile
      })
    } catch (err) {
      console.log(err)
    }
  },
  getUsers: async (req, res, cb) => {
    try {
      const users = await User.findAll({ raw: true, nest: true })
      return res.json({
        status: 'success',
        message: '',
        users
      })
    } catch (err) {
      console.log(err)
    }
  },
  getUserTweets: async (req, res) => {
    try {
      const tweets = await Tweet.findAll({
        where: { UserId: req.params.id },
        raw: true,
        nest: true
      })
      return res.json([...tweets, { status: 200, message: '' }])
    } catch (err) {
      console.log(err)
    }
  },
  getUserReplies: async (req, res) => {
    try {
      const replies = await Reply.findAll({
        where: { UserId: req.params.id },
        raw: true,
        nest: true,
        include: [{ model: Tweet, include: [User] }]
      })
      return res.status(200).json([...replies])
    } catch (err) {
      console.log(err)
    }
  },
  getUserLike: async (req, res) => {
    try {
      const likes = await Like.findAll({
        where: { UserId: req.params.id },
        include: [
          {
            model: Tweet,
            include: [User, Reply]
          }
        ],
        raw: true,
        nest: true
      })
      return res.status(200).json(likes)
    } catch (err) {
      console.log(err)
    }
  },
  getUserFollowings: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id, {
        include: [{ model: User, as: 'Followings' }]
      })
      let followings = user.dataValues.Followings
      followings = followings.map(user => ({
        followingId: user.dataValues.id,
        followingAccount: user.dataValues.account,
        followingName: user.dataValues.name,
        followingAvatar: user.dataValues.avatar
      }))
      return res.json([...followings, { status: 200, message: '' }])
    } catch (err) {
      console.log(err)
    }
  },
  getUserFollowers: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id, {
        include: [{ model: User, as: 'Followers' }]
      })
      let followers = user.dataValues.Followers
      followers = followers.map(user => ({
        followerId: user.dataValues.id,
        followerAccount: user.dataValues.account,
        followerName: user.dataValues.name,
        followerAvatar: user.dataValues.avatar
      }))
      return res.json([...followers, { status: 200, message: '' }])
    } catch (err) {
      console.log(err)
    }
  },
  putUser: async (req, res) => {
    // avatar, cover 尚未完成。
    try {
      await User.update(
        {
          introduction: req.body.introduction,
          name: req.body.name
        },
        { where: { id: helper.getUser(req).id } }
      )
      return res.json({ status: 200, message: 'success!' })
    } catch (err) {
      console.log(err)
      return res.json({ status: 'error', message: err })
    }
  },
  getCurrentUser: async (req, res) => {
    try {
      const user = await User.findByPk(helper.getUser(req).id, {
        raw: true,
        nest: true
      })
      return res.status(200).json(user)
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = userController
