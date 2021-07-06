const bcrypt = require('bcryptjs')
const { User, Tweet, Like } = require('../models')
// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

let adminController = {
  signIn: (req, res, next) => {
    if (!req.body.account || !req.body.password) {
      throw new Error('請輸入必填項目')
    }

    User.findOne({
      where: { account: req.body.account },
    })
      .then((user) => {
        if (!user) return res.status(401).json({ status: 'error', message: '此使用者尚未註冊' })

        if (!bcrypt.compareSync(req.body.password, user.password)) {
          throw new Error('密碼輸入錯誤')
        }

        var payload = { id: user.id }
        var token = jwt.sign(payload, process.env.JWT_SECRET)
        return res.json({
          status: 'success',
          message: 'ok',
          token: token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            account: user.account,
            role: user.role,
          },
        })
      })
      .catch((err) => next(err))
  },

  getTweets: (req, res, next) => {
    return Tweet.findAll({
      include: { model: User, attributes: ['name', 'avatar', 'account'] },
      raw: true,
    })
      .then((tweets) => {
        const data = tweets.map((t) => ({
          ...t,
          description: t.description.substring(0, 50),
        }))
        return res.json({ Tweets: data })
      })
      .catch((err) => next(err))
  },

  getUsers: (req, res, next) => {
    return User.findAll({
      include: [
        { model: Tweet, attributes: ['id'] },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
        { model: Like },
      ],
    }).then((users) => {
      users = users.map((user) => ({
        ...user.dataValues,
        TweetCount: user.Tweets.length,
        FollowingCount: user.Followings.length,
        FollowerCount: user.Followers.length,
        LikeCount: user.Likes.length,
      }))
      users = users.sort((a, b) => b.TweetCount - a.TweetCount)
      return res.json(users)
    })
  },
}

module.exports = adminController
