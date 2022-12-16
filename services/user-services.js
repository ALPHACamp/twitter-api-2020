const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const assert = require('assert')
const { User, Tweet, Reply } = require('../models')

const userServices = {
  // 使用者註冊
  signUp: (req, cb) => {
    const { account, name, email, password, checkPassword } = req.body
    // 驗證兩次密碼輸入是否相符，若不符則提示錯誤訊息
    if (password !== checkPassword) throw new Error('Password do not match!')
    // 使用者account & email在資料庫皆須為唯一，任一已存在資料庫則提示錯誤訊息
    Promise.all([
      User.findOne({ where: { account } }),
      User.findOne({ where: { email } })
    ])
      .then(([userFindByAccount, userFindByEmail]) => {
        assert(!userFindByAccount, 'The account already exist.')
        assert(!userFindByEmail, 'The Email already exist.')
        // input驗證OK，bcrypt密碼
        return bcrypt.hash(password, 10)
      })
      .then(hash => {
        // 建立使用者資料
        return User.create({
          account,
          name,
          email,
          password: hash
        })
      })
      .then(createdUser => cb(null, { createdUser }))
      .catch(err => cb(err))
  },
  signIn: (req, cb) => {
    try {
      const userData = req.user
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      cb(null, { token, user: userData })
    } catch (err) {
      cb(err)
    }
  },
  getUser: (req, cb) => {
    return User.findByPk(req.params.user_id)
      .then((user) => {
        if (!user) throw new Error("User didn't exist!")
        const userData = user.toJSON()
        delete userData.password
        cb(null, userData)
      })
      .catch(err => cb(err))
  },
  getTweetsOfUser: (req, cb) => {
    const UserId = req.params.user_id
    return Tweet.findAll({
      where: {
        UserId
      },
      order: [['createdAt', 'DESC']],
      raw: true

    })
      .then((tweetsOfUser) => {

        if (!tweetsOfUser) throw new Error("此用戶沒有發過推文!")
        cb(null, tweetsOfUser)

      })
      .catch(err => cb(err))
  }, getRepliesOfTweet: (req, cb) => {
    const UserId = req.params.user_id
    return Reply.findAll({
      where: {
        UserId
      },
      include: {
        model: User, include: Tweet
      },
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true

    })
      .then((repliesOfTweet) => {
        if (!repliesOfTweet) throw new Error("此用戶沒有發過推文回覆!")
        cb(null, repliesOfTweet)
      })
      .catch(err => cb(err))
  }

}
module.exports = userServices
