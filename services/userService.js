const db = require('../models')
const { User, Tweet, Reply, Like } = db
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sequelize = require('sequelize')
const { ImgurClient } = require('imgur');

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
      let user = await User.findByPk(req.params.id, {
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
      user = user.toJSON()
      user.totalFollowings = user.Followings.length
      user.totalFollowers = user.Followers.length
      user.totalTweets = user.Tweets.length
      delete user.Followings
      delete user.Followers
      delete user.Tweets
      // 為了配合測試檔，不能多包一層user，不然res.body.name會取不到，要res.body.user.name才能拿到
      return cb({
        status: '200',
        ...user,
      })
    } catch (err) {
      console.warn(err)
      return cb({ status: '500', message: err })
    }
  },

  getUserTweets: async (req, res, cb) => {
    try {
      const tweets = await Tweet.findAll({
        where: { UserId: req.params.id },
        group: `Tweet.id`,
        attributes: ['id', 'description', 'createdAt', 'updatedAt',
          [sequelize.fn('COUNT', sequelize.col('replies.id')), 'totalReplies'],
          [sequelize.fn('COUNT', sequelize.col('likes.id')), 'totalLikes']
        ],
        include: [{
          model: Reply,
          attributes: []
        },
        {
          model: Like,
          attributes: [],
        }],
        order: [['createdAt', 'DESC']]
      })
      return cb(tweets)
    } catch (err) {
      console.warn(err)
      return cb({ status: '500', message: err })
    }
  },

  putUser: async (req, res, cb) => {
    try {
      let client = new ImgurClient({ clientId: process.env.CLIENT_ID })
      const { name, account, password, checkPassword, introduction, email } = req.body
      // 使用者只能修改自己的資料
      let user = await User.findByPk(req.user.id, { attributes: { exclude: ['createdAt', 'updatedAt', 'role'] } })

      // 後端驗證
      // 密碼雙重確認
      if (password && password !== checkPassword) {
        return cb({ status: '401', message: '兩次密碼輸入需相符' })
      } else if (password && password === checkPassword) {
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        user.password = hash || user.password
      }
      // 確認account及email是否已被註冊
      if (email && email !== user.email) {
        const isUser = await User.findOne({
          where: { email },
          attributes: ['email'],
        })
        if (isUser !== null) return cb({ status: '409', message: 'Email已被使用' })
      }
      if (account && account !== user.account) {
        const isUser = await User.findOne({
          where: { account },
          attributes: ['account'],
        })
        if (isUser !== null) return cb({ status: '409', message: '帳號已被使用' })
      }
      // 圖片上傳網路，取得網址
      if (req.files) {
        const { avatar, cover } = req.files
        if (avatar && cover) {
          Promise.all([
            client.upload(avatar[0].path),
            client.upload(cover[0].path),
          ]).then(([avatar, cover]) => {
            user.avatar = avatar.data.link || 'https://image.flaticon.com/icons/png/512/149/149071.png'
            user.cover = cover.data.link || user.cover
          }).catch(err => cb({ status: '400', message: '圖片上傳失敗', err }))
        } else if (avatar && !cover) {
          const imageURL = await client.upload(avatar[0].path)
          user.avatar = imageURL.data.link || 'https://image.flaticon.com/icons/png/512/149/149071.png'
        } else {
          const imageURL = await client.upload(cover[0].path)
          user.cover = imageURL.data.link || user.cover
        }
      }
      user.name = name || user.name
      user.account = account || user.account
      user.email = email || user.email
      user.introduction = introduction ? introduction.substring(0, 160) : user.introduction
      await user.save()
      user = user.toJSON()
      delete user.password
      return cb({ status: '200', ...user })
    } catch (err) {
      console.warn(err)
      return cb({ status: '500', message: err })
    }
  }
}

module.exports = userService