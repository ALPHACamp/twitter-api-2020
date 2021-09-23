const db = require('../models')
const { User, Tweet, Reply, Like, Followship } = db
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sequelize = require('sequelize')
const { ImgurClient } = require('imgur');
const { getFollowingList, turnToBoolean } = require('../tools/helper')

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
        group: 'User.id',
        attributes: ['id', 'name', 'account', 'introduction', 'avatar', 'cover',
          [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('Followings.Followship.followingId'))), 'totalFollowings'],
          [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('Followers.Followship.followerId'))), 'totalFollowers'],
          [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('tweets.id'))), 'totalTweets'],
          [sequelize.literal(`EXISTS (SELECT 1 FROM Followships WHERE followerId = ${req.user.id} AND followingId = User.id)`), 'isFollowings']
        ],
        include: [{
          model: User,
          as: 'Followings',
          attributes: [],
          through: { attributes: [] }
        },
        {
          model: User,
          as: 'Followers',
          attributes: [],
          through: { attributes: [] }
        },
        {
          model: Tweet,
          attributes: [],
        }
        ]
      })
      user = user.toJSON()
      turnToBoolean(user, 'isFollowings')
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
        raw: true,
        where: { UserId: req.params.id },
        group: `Tweet.id`,
        attributes: ['id', 'description', 'createdAt', 'updatedAt',
          [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('replies.id'))), 'totalReplies'],
          [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('likes.id'))), 'totalLikes'],
          [sequelize.literal(`EXISTS (SELECT 1 FROM Likes WHERE UserId = ${req.user.id} AND TweetId = Tweet.id)`), 'isLiked']
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
      turnToBoolean(tweets, 'isLiked')
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
      if (req.user.id != req.params.id) return cb({ status: '401', message: '無法修改他人資料' })
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

      if (req.body.cover === 'delete') user.cover = ''

      // 圖片上傳網路，取得網址
      if (req.files) {
        const { avatar, cover } = req.files
        if (avatar && cover) {
          const images = await client.upload([
            {
              image: avatar[0].path,
              title: 'avatar'
            },
            {
              image: cover[0].path,
              title: 'cover'
            }
          ])
          user.avatar = images[0].data.link || user.avatar
          user.cover = images[1].data.link || user.cover
        } else if (avatar && !cover) {
          const imageURL = await client.upload(avatar[0].path)
          user.avatar = imageURL.data.link || 'https://image.flaticon.com/icons/png/512/149/149071.png'
        } else if (!avatar && cover) {
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
  },

  getUserFollowings: async (req, res, cb) => {
    try {
      // 取得該特定使用者的追蹤名單
      let user = await User.findOne({
        where: { id: req.params.id },
        include: {
          model: User, as: 'Followings', attributes: [['id', 'followingId'], 'name', 'account', 'avatar', 'introduction',
          [
            sequelize.literal(`EXISTS (SELECT 1 FROM Followships WHERE followerId = ${req.user.id} AND followingId = Followings.id)`), 'isFollowings'
          ]],
          through: { attributes: [] },
        },
        order: [[sequelize.col('Followings.Followship.createdAt'), 'DESC']]
      })
      if (user === null) return cb({ status: '400', message: '使用者不存在' })
      // 比對id，看登入使用者是否也有在追蹤這些人
      user = user.toJSON()
      turnToBoolean(user.Followings, 'isFollowings')
      return cb(user.Followings)
    } catch (err) {
      console.warn(err)
      return cb(err)
    }
  },

  getUserFollowers: async (req, res, cb) => {
    try {
      const followingList = await getFollowingList(req)
      let user = await User.findOne({
        attributes: [],
        where: { id: req.params.id },
        include: [{
          model: User, as: 'Followers',
          attributes: [['id', 'followerId'], 'name', 'account', 'avatar', 'cover', 'introduction'],
          through: { attributes: [] }
        }],
        order: [[sequelize.col('Followers.Followship.createdAt'), 'DESC']]
      })
      if (user === null) return cb({ status: '400', message: '使用者不存在' })
      user = user.toJSON()
      user.Followers.map(user => {
        user.isFollowings = followingList.includes(user.followerId)
      })
      return cb(user.Followers)
    } catch (err) {
      console.warn(err)
      return cb(err)
    }
  },

  getUserLikedTweets: async (req, res, cb) => {
    try {
      // 取得該使用者喜歡的推文
      let likedTweets = await Tweet.findAll({
        raw: true, nest: true,
        group: 'Tweet.id',
        attributes: [['id', 'TweetId'], 'description', 'createdAt', 'updatedAt',
        [sequelize.literal('(SELECT COUNT(id) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'totalLikes'],
        [sequelize.literal('(SELECT COUNT(id) FROM Replies WHERE Replies.TweetId = Tweet.id)'),
          'totalReplies'],
        [sequelize.literal(`EXISTS (SELECT 1 FROM Likes WHERE UserId = ${req.user.id} AND TweetId = Tweet.id)`), 'isLiked']
        ],
        include: [{
          model: Like, attributes: [], where: { UserId: req.params.id } //僅限目標用戶按過讚的
        },
        { model: Reply, attributes: [] },
        { model: User, attributes: ['id', 'name', 'avatar', 'account'] }
        ],
        order: [['Likes', 'createdAt', 'DESC']]
      })
      turnToBoolean(likedTweets, 'isLiked')
      return cb(likedTweets)
    } catch (err) {
      console.warn(err)
      return cb(err)
    }
  },

  getUserReplies: async (req, res, cb) => {
    try {
      // 取得特定使用者的所有回覆、回覆給誰、哪則推文
      return cb(await Reply.findAll({
        raw: true, nest: true,
        attributes: { exclude: ['id', 'UserId'] },
        where: { UserId: req.params.id },
        include: { model: Tweet, attributes: [], include: { model: User, attributes: ['name'] } },
        order: [['createdAt', 'DESC']]
      }))
    } catch (err) {
      console.warn(err)
      return cb({ status: '500', message: err })
    }
  },

  getTopUser: async (req, res, cb) => {
    try {
      const followingList = await getFollowingList(req)
      const user = await User.findAll({
        raw: true, nest: true,
        where: {
          role: {
            [sequelize.Op.ne]: 'admin'
          }
        },
        group: 'User.id',
        attributes: ['id', 'name', 'account', 'avatar',
          [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('Followers.id'))), 'totalFollowers']
        ],
        include: {
          model: User, as: 'Followers',
          attributes: [], through: { attributes: [] }
        },
        order: [[sequelize.col('totalFollowers'), 'DESC']],
        subQuery: false, //避免因查詢多張表造成limit失常
        having: { totalFollowers: { [sequelize.Op.gt]: 0 } }, //只要粉絲大於0的人
        limit: 10
      })
      // 登入者有否有追蹤
      user.forEach(user => {
        user.isFollowings = followingList.includes(user.id)
      })
      return cb(user)
    } catch (err) {
      console.warn(err)
      return cb({ status: '500', message: err })
    }
  },

  getCurrentUser: async (req, res, cb) => {
    try {
      const user = await User.findOne({
        attributes: { exclude: ['password'] },
        where: { id: req.user.id }
      })
      return cb(user)
    } catch (err) {
      console.warn(err)
      return cb({ status: '500', message: err })
    }
  }
}

module.exports = userService