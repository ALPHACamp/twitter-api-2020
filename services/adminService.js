const db = require('../models')
const { User, Tweet, Like } = db
const { Op } = require('sequelize')
const bcrypt = require('bcryptjs')

//JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy


const adminService = {
  // 登入
  signIn: (req, res, callback) => {
    // 檢查必要資料
    if (!req.body.email || !req.body.password) {
      return callback({ status: 'error', message: "required fields didn't exist" })
    }
    // 檢查 user 是否存在與密碼是否正確
    let username = req.body.email
    let password = req.body.password

    User.findOne({ where: { email: username } })
      .then((user) => {
        // 帳號不存在
        if (!user) {
          return callback({ status: 'error', message: 'no such user found' })
        }

        // 密碼錯誤
        if (!bcrypt.compareSync(password, user.password)) {
          return callback({ status: 'error', message: 'passwords did not match' })
        }

        // 簽發 token
        let payload = { id: user.id }
        let token = jwt.sign(payload, process.env.JWT_SECRET)
        return callback({
          status: 'success',
          message: 'ok',
          token: token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        })
      })
  },

  // 瀏覽 User 清單
  getUsers: (req, res, callback) => {
    return User.findAll({
      where: { role: { [Op.not]: 'admin' } },
      include: [
        { model: Tweet },
        { model: Like },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
      .then((users) => {
        const usersData = users.map((user) => ({
          ...user.dataValues,
          tweetsCount: user.Tweets.length,
          likesCount: user.Likes.length,
          followersCount: user.Followers.length,
          followingsCount: user.Followings.length
        }))
          .sort((a, b) => b.tweetsCount - a.tweetsCount)

        callback(usersData)
      })
  },

  // 瀏覽 Tweet 清單
  getTweets: (req, res, callback) => {
    return Tweet.findAll({
      include: [User],
      order: [['updatedAt', 'DESC']],
      raw: true,
      nest: true
    })
      .then((tweets) => {
        const tweetsData = tweets.map((tweet) => ({
          id: tweet.id,
          description: tweet.description.slice(0, 49),
          createdAt: tweet.createdAt,
          updatedAt: tweet.updatedAt,
          User: {
            id: tweet.User.id,
            account: tweet.User.account,
            name: tweet.User.name,
            avatar: tweet.User.avatar
          }
        }))

        callback(tweetsData)
      })
  },

  // 刪除推文
  deleteTweet: (req, res, callback) => {
    return Tweet.findByPk(req.params.id)
      .then((tweet) => {
        tweet.destroy()
          .then((result) => {
            callback({ status: 'success', message: 'Delete Tweet Success' })
          })
      })
      .catch((error) => callback({ status: 'error', message: 'Delete Tweet Fail' }))
  }
}

module.exports = adminService