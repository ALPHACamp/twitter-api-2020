const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const sequelize = require('sequelize')

const { User, Tweet, Reply, Like, Followship, Notice } = require('../models')
const helpers = require('../_helpers')
const replyController = require('../controllers/api/replyController')

const userService = {
  signUp: (req, res, callback) => {
    if (req.body.checkPassword !== req.body.password) {
      return callback({ status: 'error', message: '兩次密碼輸入不同！' })
    }

    return User.findOne({ where: { account: req.body.account } }).then(user => {
      if (!user) {
        return User.create({
          account: req.body.account,
          name: req.body.name,
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
        })
          .then(user => {
            return callback({ status: 'success', message: '成功註冊帳號！' })
          })
          .catch(err => console.log(err))
      }
      user.email === req.body.email
        ? callback({ status: 'error', message: 'email和account 已重覆註冊！' })
        : callback({ status: 'error', message: 'account 已重覆註冊！' })
    })
  },

  signIn: (req, res, callback) => {
    // 檢查必要資料
    if (!req.body.account || !req.body.password) {
      return callback({ status: 'error', message: '所有欄位皆為必填！' })
    }

    // 檢查 user 是否存在與密碼是否正確
    const account = req.body.account
    const password = req.body.password

    User.findOne({ where: { account: account } }).then(async user => {
      if (!user) return callback({ status: 'error', message: '帳號不存在或密碼錯誤！' })
      if (user.role === 'admin') return callback({ status: 'error', message: '此帳號無法登入' })
      if (!bcrypt.compareSync(password, user.password)) {
        return callback({ status: 'error', message: '帳號不存在或密碼錯誤！' })
      }
      // 簽發 token
      const payload = { id: user.id }
      const token = await jwt.sign(payload, process.env.JWT_SECRET)
      return callback({
        status: 'success',
        message: '登入成功！',
        token: token,
        user: {
          id: user.id,
          account: user.account,
          name: user.name,
          email: user.email,
          role: user.role
        }
      })
    })
  },

  getUsers: (req, res, callback) => {
    return User.findAll({
      include: [{ model: User, as: 'Followers' }, { model: User, as: 'Followings' }]
    }).then(users => {
      users = users.map(user => ({
        ...user.toJSON(),
        followerCount: user.Followers.length
      }))
      return callback(users)
    })
  },

  getUser: (req, res, callback) => {
    const userId = req.params.id
    return User.findOne({
      where: { id: userId },
      attributes: [
        'id',
        'account',
        'name',
        'avatar',
        'cover',
        'introduction',
        'role',
        [sequelize.literal(`(SELECT COUNT(*) FROM Tweets WHERE Tweets.UserId = ${userId})`), 'TweetCount'],
        [
          sequelize.literal(`(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = ${userId})`),
          'FollowerCount'
        ],
        [
          sequelize.literal(`(SELECT COUNT(*) FROM Followships WHERE Followships.followerId = ${userId})`),
          'FollowingCount'
        ],
        [
          sequelize.literal(
            `exists(SELECT 1 FROM Followships WHERE followerId = ${helpers.getUser(req).id} and followingId = User.id )`
          ),
          'isFollowed'
        ],
        [
          sequelize.literal(
            `exists(SELECT 1 FROM Notices WHERE noticerId = ${helpers.getUser(req).id} and noticingId = User.id )`
          ),
          'isNoticed'
        ]
      ]
    }).then(user => {
      user = {
        ...user.toJSON(),
        isCurrentUser: Number(req.params.id) === Number(helpers.getUser(req).id)
      }
      if (user.role === 'admin') {
        return callback({ status: 'error', message: '帳號不存在！' })
      }
      return callback(user)
    })
  },

  putUser: async (req, res, callback) => {
    try {
      if (Number(req.params.id) !== Number(helpers.getUser(req).id)) {
        return callback({ status: 'error', message: '沒有編輯權限！' })
      }

      const { name, introduction, avatar, cover } = req.body
      const { files } = req

      const user = await User.findByPk(req.params.id)
      if (cover === '') {
        user.cover = 'https://i.imgur.com/Qqb0a7S.png'
      }

      if (!files) {
        await user.update({
          name,
          introduction,
          avatar,
          cover: user.cover
        })
        return callback({ status: 'success', message: '使用者資料編輯成功！(沒傳圖）' })
      } else {
        imgur.setClientID(IMGUR_CLIENT_ID)
        const uploadImg = file => {
          return new Promise((resolve, reject) => {
            imgur.upload(file, (err, res) => {
              resolve(res.data.link)
            })
          })
        }

        const newAvatar = files.avatar ? await uploadImg(files.avatar[0].path) : user.avatar
        const newCover = files.cover ? await uploadImg(files.cover[0].path) : user.cover

        await user.update({
          name,
          introduction,
          avatar: newAvatar,
          cover: newCover
        })
        return callback({ status: 'success', message: '使用者資料編輯成功！(有傳圖）' })
      }
    } catch (err) {
      return callback({ status: 'error', message: '編輯未成功！' })
    }
  },

  putUserSetting: async (req, res, callback) => {
    try {
      const { name, account, email, password, checkPassword } = req.body
      if (Number(req.params.id) !== Number(helpers.getUser(req).id)) {
        return callback({ status: 'error', message: '沒有編輯權限！' })
      }

      if (account !== helpers.getUser(req).account) {
        const existUser = await User.findOne({
          where: { account },
          raw: true
        })
        if (existUser) return callback({ status: 'error', message: 'account 已重覆註冊！' })
      }

      if (email !== helpers.getUser(req).email) {
        const existUser = await User.findOne({
          where: { email },
          raw: true
        })
        if (existUser) return callback({ status: 'error', message: 'email 已重覆註冊！' })
      }

      if (password !== checkPassword) {
        return callback({ status: 'error', message: '兩次密碼輸入不同！' })
      }

      const user = await User.findByPk(req.params.id)
      await user.update({
        name,
        account,
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
      })

      return callback({ status: 'success', message: '使用者資料編輯成功！' })
    } catch (err) {
      console.log(err)
      return callback({ status: 'error', message: '編輯未成功！' })
    }
  },

  getTopUser: (req, res, callback) => {
    return User.findAll({
      raw: true,
      nest: true,
      attributes: [
        'id',
        'name',
        'account',
        'avatar',
        [
          sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE User.id = Followships.followingId)'),
          'FollowerCount'
        ]
      ],
      include: [{ model: User, as: 'Followers', attributes: ['id', 'account'] }]
    }).then(users => {
      users = users.map(user => ({
        ...user,
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
      }))
      users = users
        .filter((now, index, array) => array.findIndex(target => target.id === now.id) === index)
        .sort((a, b) => b.FollowerCount - a.FollowerCount)
        .slice(0, 10)
      return callback({ users })
    })
  },

  addFollowing: (req, res, callback) => {
    return Followship.create({
      followerId: helpers.getUser(req).id,
      followingId: req.body.id
    }).then(followship => {
      return callback({ status: 'success', message: '追隨成功' })
    })
  },

  removeFollowing: (req, res, callback) => {
    return Followship.destroy({
      where: {
        followerId: helpers.getUser(req).id,
        followingId: req.params.followingId
      }
    }).then(followship => {
      return callback({ status: 'success', message: '取消追隨成功' })
    })
  },

  getUserFollowings: (req, res, callback) => {
    return User.findByPk(req.params.id, {
      include: [
        { model: User, as: 'Followings', attributes: ['id', 'account', 'name', 'avatar', 'introduction', 'createdAt'] }
      ]
    }).then(user => {
      user = user.toJSON()
      user.Followings.forEach(item => {
        item.followingId = item.id
        item.isFollowed = helpers.getUser(req).Followings.map(d => d.id).includes(item.id)
      })
      user = user.Followings.sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)
      return callback(user)
    })
  },

  getUserFollowers: (req, res, callback) => {
    return User.findByPk(req.params.id, {
      include: [
        { model: User, as: 'Followers', attributes: ['id', 'account', 'name', 'avatar', 'introduction', 'createdAt'] }
      ]
    }).then(user => {
      user = user.toJSON()
      user.Followers.forEach(item => {
        item.followerId = item.id
        item.isFollowed = helpers.getUser(req).Followings.map(d => d.id).includes(item.id)
      })
      user = user.Followers.sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)
      return callback(user)
    })
  },

  addNoticing: (req, res, callback) => {
    return Notice.create({
      noticerId: helpers.getUser(req).id,
      noticingId: req.body.id
    }).then(notice => {
      return callback({ status: 'success', message: '已開啟訂閱' })
    })
  },

  removeNoticing: (req, res, callback) => {
    return Notice.destroy({
      where: {
        noticerId: helpers.getUser(req).id,
        noticingId: req.params.noticeId
      }
    }).then(notice => {
      return callback({ status: 'success', message: '已取消訂閱' })
    })
  },

  getUserReplies: (req, res, callback) => {
    return Reply.findAll({
      where: { UserId: req.params.id },
      include: [
        { model: User, attributes: ['id', 'account', 'name', 'avatar'] },
        {
          model: Tweet,
          attributes: ['id', 'UserId'],
          include: [{ model: User, attributes: ['id', 'name', 'account'] }]
        }
      ],
      order: [['createdAt', 'DESC']]
    }).then(replies => {
      return callback(replies)
    })
  },

  getUserTweets: (req, res, callback) => {
    User.findByPk(req.params.id).then(user => {
      if (!user || user.role === 'admin') {
        return callback({ status: 'error', message: '帳號不存在！' })
      }
      Tweet.findAll({
        where: { UserId: user.id },
        attributes: [
          ['id', 'TweetId'],
          'description',
          'createdAt',
          [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'ReplyCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'LikeCount'],
          [
            sequelize.literal(
              `exists(SELECT 1 FROM Likes WHERE UserId = ${helpers.getUser(req).id} and TweetId = Tweet.id)`
            ),
            'isLiked'
          ]
        ],
        include: [{ model: User, attributes: ['id', 'avatar', 'name', 'account'] }],
        order: [['createdAt', 'DESC']]
      }).then(tweets => {
        return callback(tweets)
      })
    })
  },

  getUserLikes: (req, res, callback) => {
    User.findByPk(req.params.id).then(user => {
      if (!user || user.role === 'admin') {
        return callback({ status: 'error', message: '帳號不存在！' })
      }
      Like.findAll({
        raw: true,
        nest: true,
        where: { UserId: user.id },
        attributes: [['id', 'LikeId'], 'TweetId', 'createdAt'],
        include: [
          {
            model: Tweet,
            attributes: [
              'description',
              [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'ReplyCount'],
              [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'LikeCount']
            ]
          },
          { model: User, attributes: ['id', 'avatar', 'name', 'account'] }
        ],
        order: [['createdAt', 'DESC']]
      }).then(likes => {
        likes.forEach(like => {
          like.Tweet.isLiked = true
        })
        return callback(likes)
      })
    })
  },

  getCurrentUser: (req, res, callback) => {
    return User.findByPk(helpers.getUser(req).id).then(user => {
      if (!user) {
        return callback({ status: 'error', message: '帳號不存在！' })
      }
      return callback(user)
    })
  }
}

module.exports = userService
