const db = require('../models')
const { User, Tweet, Like, Reply } = db
const { Op } = require('sequelize')
const bcrypt = require('bcryptjs')
const sequelize = require('sequelize')

//JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy


const adminService = {
  // 登入
  signIn: (req, res, callback) => {
    // 檢查必要資料
    if (!req.body.account || !req.body.password) {
      return callback({ status: 'error', message: "required fields didn't exist" })
    }
    // 檢查 user 是否存在與密碼是否正確
    let username = req.body.account
    let password = req.body.password

    User.findOne({ where: { account: username } })
      .then((user) => {
        // 帳號不存在
        if (!user) {
          return callback({ status: 'error', message: 'no such user found' })
        }

        // admin only
        if (user.role !== 'admin') {
          return res.json({ status: 'error', message: "only for admin signin" })
        }

        // 密碼錯誤
        if (!bcrypt.compareSync(password, user.password)) {
          return callback({ status: 'error', message: 'passwords did not match' })
        }
        const showAccount = '@' + user.account
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
            account: showAccount,
            email: user.email,
            avatar: user.avatar,
            role: user.role
          }
        })
      })
      .catch((error) => callback({ status: 'error', message: error }))
  },

  // 瀏覽 User 清單
  getUsers: (req, res, callback) => {
    return User.findAll({
      // where: { role: { [Op.not]: 'admin' } },
      include: [
        { model: Tweet, include: { model: Like } },
        { model: Like },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
      .then((users) => {
        // 計算推文被按讚次數
        const usersData = users.map((user) => {
          let tweetByLike = 0
          let tweetArray = user.Tweets.map((tweet) => {
            return tweetByLike += tweet.Likes.length
          })

          return {
            ...user.dataValues,
            account: '@' + user.dataValues.account,
            tweetsNumber: user.Tweets.length,
            likesNumber: user.Likes.length,
            gotLikesNumber: tweetByLike,
            followingsNumber: user.Followings.length, // 追隨者
            followersNumber: user.Followers.length // 被追隨
          }
        })
          .sort((a, b) => b.tweetsCount - a.tweetsCount)

        // const usersData = users.map((user) => ({
        //   ...user.dataValues,
        //   tweetsCount: user.Tweets.length,
        //   likesCount: user.Likes.length,
        //   tweetByLike: tweetByLike,
        //   followersCount: user.Followers.length,
        //   followingsCount: user.Followings.length
        // }))
        // .sort((a, b) => b.tweetsCount - a.tweetsCount)

        callback(usersData)
      })
      .catch((error) => callback({ status: 'error', message: error }))
  },


  getUsersLight: (req, res, callback) => {
    return User.findAll({
      // where: { role: { [Op.not]: 'admin' } },
      include: [
        { model: Tweet, include: { model: Like } },
        { model: Like },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
      .then((users) => {
        // 計算推文被按讚次數
        const usersData = users.map((user) => {
          let tweetByLike = 0
          let tweetArray = user.Tweets.map((tweet) => {
            return tweetByLike += tweet.Likes.length
          })

          return {
            id: user.dataValues.id,
            name: user.dataValues.name,
            email: user.dataValues.email,
            account: '@' + user.dataValues.account,
            avatar: user.dataValues.avatar,
            cover: user.dataValues.cover,
            tweetsNumber: user.Tweets.length,
            likesNumber: user.Likes.length,
            gotLikesNumber: tweetByLike,
            followingsNumber: user.Followings.length, // 追隨者
            followersNumber: user.Followers.length // 被追隨
          }
        })
          .sort((a, b) => b.tweetsCount - a.tweetsCount)

        return callback(usersData)
      })
      .catch((error) => callback({ status: 'error', message: error }))
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
        const tweetsData = tweets.map((tweet) => {
          const showAccount = '@' + tweet.User.account
          return {
            status: 'success',
            message: 'ok',
            id: tweet.id,
            description: tweet.description.slice(0, 49),
            createdAt: tweet.createdAt,
            updatedAt: tweet.updatedAt,
            User: {
              id: tweet.User.id,
              name: tweet.User.name,
              account: showAccount,
              avatar: tweet.User.avatar
            }
          }
        })

        callback(tweetsData)
      })
      .catch((error) => callback({ status: 'error', message: error }))
  },

  // 刪除推文
  deleteTweet: (req, res, callback) => {
    const id = req.params.tweet_id
    return Tweet.findByPk(id)
      .then((tweet) => {
        if (!tweet) {
          return callback({ status: 'error', message: 'Tweet id was not exist' })
        }

        tweet.destroy()
          .then((result) => {
            return callback({ status: 'success', message: 'Delete Tweet By Admin Success' })
          })
      })
      .catch((error) => callback({ status: 'error', message: 'Delete Tweet Fail' }))
  }
}

module.exports = adminService