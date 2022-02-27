const jwt = require('jsonwebtoken')
const { User, Tweet, Like, Reply } = require('../models')
const helpers = require('../_helpers')
const bcrypt = require('bcryptjs')

const adminController = {
  signIn: (req, res, next) => {
    // 從req取資料
    const { account, password } = req.body

    // 以account取user data
    return User.findOne({ where: { account } })
      .then(user => {
        // 判斷使用者是否存在
        if (!user) return res.json({ status: 'error', message: '帳號與密碼不存在' })
        user = user.toJSON()

        return bcrypt.compare(password, user.password)
          .then(isCorrect => {
            // 判斷密碼與使用者身份是否正確
            if (!isCorrect) return res.json({ status: 'error', message: '帳號與密碼不存在' })
            if (user.role !== 'admin') return res.json({ status: 'error', message: '帳號與密碼不存在' })

            // 透過jwt簽發token
            const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '30d' })
            delete user.password
            // 傳給用戶端
            return res.json({
              status: 'success',
              token,
              user
            })
          })
          .catch(err => next(err))
      })
  },
  getUsers: (req, res, next) => {
    return User.findAll({
      include: [
        Reply,
        { model: Tweet, include: Like },
        { model: User, as: "Followings" },
        { model: User, as: "Followers" },
      ],
      attributes: ['id', 'name', 'avatar', 'cover']
    })
      .then(users => {
        users = users.map(user => ({
          ...user.dataValues,
          followingCount: user.dataValues.Followings.length,
          followersCount: user.dataValues.Followers.length,
          // likedCount: ,
          tweetCount: user.dataValues.Tweets.length
        }))
        users.sort((a, b) => b.tweetCount - a.tweetCount)
        return res.json(users)
      })
      .catch(err => next(err))
  },
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      include: User,
      order: [['createdAt', 'DESC']]
    })
      .then(tweet => {
        tweet = tweet.map(t => ({
          ...t.dataValues,
          description: t.description.substring(0, 50)
        }))
        return res.json(tweet)
      })
  },
  deleteTweet: (req, res, next) => {
    Tweet.destroy({ where: { id: req.params.id } })
      .then(res.json({ status: 'success', message: '成功刪除' }))
      .catch(err => next(err))
  }
}

module.exports = adminController