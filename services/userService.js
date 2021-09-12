const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userService = {
  signUp: async (req, res, cb) => {
    try {
      const { account, name, email, checkPassword } = req.body
      let { password } = req.body
      const errors = []
      // 後端驗證
      if (!name || !account || !email || !password || !checkPassword) errors.push('所有欄位都是必填項')
      if (name && name.length > 50) errors.push('名稱需小於50字')
      if (password !== checkPassword) errors.push('兩次密碼輸入需相符')

      const userEmail = await User.findOne({ where: { email }, attributes: ['email'] })
      if (userEmail) cb({ status: '409', message: 'Email已存在' })

      const userAccount = await User.findOne({ where: { account }, attributes: ['account'] })
      if (userAccount) cb({ status: '409', message: 'Account已被使用' })

      // 通過驗證，建立帳號
      if (!errors.length) {
        const salt = await bcrypt.genSalt(10)
        password = await bcrypt.hash(password, salt)
        await User.create({ account, name, email, password })
        return cb({ status: '200', message: '帳號建立成功' })
      } else {
        return cb({ status: '400', message: errors })
      }
    } catch (err) {
      return cb({ status: '500', message: err })
    }
  },

  login: async (req, res, cb) => {
    try {
      const { account, password } = req.body
      if (!account || !password) {
        return cb({ status: '401', message: '所有欄位都是必填項', data: { account, password } })
      }
      const user = await User.findOne({ where: { account } })
      if (!user) {
        return cb({ status: '401', message: '帳號不存在', data: { account, password } })
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return cb({ status: '401', message: '密碼錯誤', data: { account, password } })
      }
      // 簽發token
      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.TOKEN_SECRET)
      return cb({ status: '200', message: '登入成功', token, user })
    } catch (err) {
      return cb({ status: '500', message: err })
    }
  },

  getUser: async (req, res, cb) => {
    try {
      const user = await User.findByPk(req.params.id, {
        attributes: ['id', 'name', 'account', 'introduction', 'avatar', 'cover'],
        include: [{
          model: User,
          as: 'Followings',
          attributes: ['id'],
          through: { attributes: [] }
        },
        {
          model: User,
          as: 'Followers',
          attributes: ['id'],
          through: { attributes: [] }
        },
        {
          model: Tweet,
          attributes: ['id'],
        }
        ]
      })
      const totalFollowings = user.Followings.length
      const totalFollowers = user.Followers.length
      const totalTweets = user.Tweets.length
      // 為了配合測試檔，不能多包一層user，不然res.body.name會取不到，要res.body.user.name才能拿到
      return cb({
        status: '200',
        id: user.id,
        name: user.name,
        account: user.account,
        introduction: user.introduction,
        avatar: user.avatar,
        cover: user.cover,
        Followings: user.Followings,
        Followers: user.Followers,
        Tweets: user.Tweets,
        totalFollowings, totalFollowers, totalTweets
      })
    } catch (err) {
      console.warn(err)
      return cb({ status: '500', message: err })
    }
  }
}

module.exports = userService