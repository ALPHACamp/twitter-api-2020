const sequelize = require('sequelize')
const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User
const userServices = require('../services/userServices')

// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const userController = {
  signIn: (req, res) => {
    // 檢查必要資料
    if (!req.body.account || !req.body.password) {
      return res.json({ status: 'error', message: "required fields didn't exist" })
    }
    // 檢查 user 是否存在與密碼是否正確
    let account = req.body.account
    let password = req.body.password

    User.findOne({
      where: {
        account: db.sequelize.where(
          db.sequelize.literal('BINARY account'),
          `${account}`
        )
      }
    }).then(user => {
      if (!user) return res.status(401).json({ status: 'error', message: 'no such user found' })
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: 'passwords did not match' })
      }
      // 簽發 token
      var payload = { id: user.id }
      var token = jwt.sign(payload, 'alphacamp')
      return res.json({
        status: 'success',
        message: 'ok',
        token: token,
        user: {
          id: user.id, account: user.account, name: user.name, email: user.email, role: user.role, avatar: user.avatar, cover: user.cover, introduction: user.introduction
        }
      })
    })
  },
  signUp: (req, res) => {
    if (!req.body.name || !req.body.account || !req.body.email || !req.body.password || !req.body.checkPassword) {
      return res.json({
        status: 'error',
        message: '所有欄位皆為必填',
        name: req.body.name,
        account: req.body.account,
        email: req.body.email,
        password: req.body.password,
        checkPassword: req.body.checkPassword,
      })
    }
    if (req.body.password !== req.body.checkPassword) {
      return res.json({
        status: 'error',
        message: '兩次密碼輸入不同！',
        name: req.body.name,
        account: req.body.account,
        email: req.body.email,
      })
    } else {
      User.findOne({ where: { account: req.body.account } })
        .then(user => {
          if (user) {
            return res.json({
              status: 'error',
              message: '此帳號已被使用，請換一組！',
              name: req.body.name,
              account: req.body.account,
              email: req.body.email,
              password: req.body.password,
              checkPassword: req.body.checkPassword,
            })
          } else {
            User.findOne({ where: { email: req.body.email } })
              .then(user => {
                if (user) {
                  return res.json({
                    status: 'error',
                    message: '此信箱已註冊過！',
                    name: req.body.name,
                    account: req.body.account,
                    email: req.body.email,
                    password: req.body.password,
                    checkPassword: req.body.checkPassword
                  })
                } else {
                  User.create({
                    name: req.body.name,
                    account: req.body.account,
                    email: req.body.email,
                    password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
                    role: 'user',
                    avatar: 'https://cdn.pixabay.com/photo/2018/04/18/18/56/user-3331256__340.png',
                    cover: 'https://m.dw.com/image/48396304_101.jpg'
                  })
                    .then(user => {
                      return res.json({
                        status: 'success',
                        message: '帳號註冊成功！'
                      })
                    })
                }
              })
          }
        })
    }
  },
  getProfile: (req, res) => {
    userServices.getProfile(req, res, (data) => {
      return res.json(data)
    })
  },
  putProfile: (req, res) => {
    userServices.putProfile(req, res, (data) => {
      return res.json(data)
    })
  },
  getTopUsers: (req, res) => {
    userServices.getTopUsers(req, res, (data) => {
      return res.json(data)
    })
  },
  getFollowings: (req, res) => {
    userServices.getFollowings(req, res, (data) => {
      return res.json(data)
    })
  },
  getFollowers: (req, res) => {
    userServices.getFollowers(req, res, (data) => {
      return res.json(data)
    })
  },
  getTweets: (req, res) => {
    userServices.getTweets(req, res, (data) => {
      return res.json(data)
    })
  },
  likeTweet: (req, res) => {
    userServices.likeTweet(req, res, data => {
      return res.json(data)
    })
  },
  unlikeTweet: (req, res) => {
    userServices.unlikeTweet(req, res, data => {
      return res.json(data)
    })
  },
  getUserReplies: (req, res) => {
    userServices.getUserReplies(req, res, data => {
      return res.json(data)
    })
  },
  getUserLikes: (req, res) => {
    userServices.getUserLikes(req, res, data => {
      return res.json(data)
    })
  },
  getSettingPage: (req, res) => {
    userServices.getSettingPage(req, res, data => {
      return res.json(data)
    })
  },
  putSetting: (req, res) => {
    userServices.putSetting(req, res, data => {
      return res.json(data)
    })
  },
  getCurrentUser: (req, res) => {
    userServices.getCurrentUser(req, res, data => {
      return res.json(data)
    })
  },
  getUsers: (req, res) => {
    userServices.getUsers(req, res, data => {
      return res.json(data)
    })
  }
}

module.exports = userController
