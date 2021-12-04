const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const sequelize = require('sequelize')

const { User, Tweet, Followship, Notice } = require('../models')
const helpers = require('../_helpers')

const userService = {
  signUp: (req, res, callback) => {
    if (req.body.checkPassword !== req.body.password) {
      return callback({ status: 'error', message: '兩次密碼輸入不同！' })
    } else {
      return User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          return callback({ status: 'error', message: 'email 已重覆註冊！' })
        } else {
          User.create({
            account: req.body.account,
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            return callback({ status: 'success', message: '成功註冊帳號！' })
          })
        }
      })
    }
  },

  signIn: (req, res, callback) => {
    // 檢查必要資料
    if (!req.body.email || !req.body.password) {
      return callback({ status: 'error', message: '所有欄位皆為必填！' })
    }
    // 檢查 user 是否存在與密碼是否正確
    const username = req.body.email
    const password = req.body.password

    User.findOne({ where: { email: username } }).then(user => {
      if (!user) return callback({ status: 'error', message: '帳號不存在或密碼錯誤！' })
      if (!bcrypt.compareSync(password, user.password)) {
        return callback({ status: 'error', message: '帳號不存在或密碼錯誤！' })
      }
      // 簽發 token
      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
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
        [sequelize.literal(`(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = ${userId})`), 'FollowerCount'],
        [sequelize.literal(`(SELECT COUNT(*) FROM Followships WHERE Followships.followerId = ${userId})`), 'FollowingCount'],
        [sequelize.literal(`exists(SELECT 1 FROM Followships WHERE followerId = ${helpers.getUser(req).id} and followingId = User.id )`), 'isFollowed'],
        [sequelize.literal(`exists(SELECT 1 FROM Notices WHERE noticerId = ${helpers.getUser(req).id} and noticingId = User.id )`), 'isNoticed']
      ]
    }).then(user => {
      user = {
        ...user.toJSON(),
        isCurrentUser: Number(req.params.id) === Number(helpers.getUser(req).id)
      }
      if (user.role === 'admin') {
        return callback({ status: 'error', message: '帳號不存在！' })
      }
      console.log(user)
      return callback(user)
    })
  },

  putUser: async (req, res, callback) => {
    try {
      const { account, email } = req.body

      // 不同人
      if (Number(req.params.id) !== Number(helpers.getUser(req).id)) {
        return callback({ status: 'error', message: '沒有編輯權限！' })
      }

      // account 已重覆
      if (account && account !== helpers.getUser(req).account) {
        const existUser = await User.findOne({
          where: { account },
          raw: true
        })
        if (existUser) return callback({ status: 'error', message: 'account 已重覆註冊！' })
      }

      // email 已重覆
      if (email && email !== helpers.getUser(req).email) {
        const existUser = await User.findOne({
          where: { email },
          raw: true
        })
        if (existUser) return callback({ status: 'error', message: 'email 已重覆註冊！' })
      }

      const user = await User.findByPk(req.params.id)

      const { files } = req

      // 如果有圖
      if (files) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        const uploadImg = (file) => {
          return new Promise((resolve, reject) => {
            imgur.upload(file, (err, res) => {
              resolve(res.data.link)
            })
          })
        }

        const avatar = files.avatar ? await uploadImg(files.avatar[0].path) : null
        const cover = files.cover ? await uploadImg(files.cover[0].path) : null

        await user.update({
          ...req.body,
          avatar,
          cover
        })
        return callback({ status: 'success', message: '使用者資料編輯成功！' })
      }

      await user.update({ ...req.body })
      return callback({ status: 'success', message: '使用者資料編輯成功！' })
    } catch (err) {
      console.log(err)
      return callback({ status: 'error', message: '編輯未成功！' })
    }
  },

  getTopUser: (req, res, callback) => {
    return User.findAll({
      include: [{ model: User, as: 'Followers', attributes: ['id'] }]
    }).then(users => {
      users = users.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
      }))
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount).slice(0, 10)
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
      include: [{ model: User, as: 'Followings', attributes: ['id', 'account', 'name', 'introduction', 'createdAt'] }]
    }).then(user => {
      user = user.toJSON()
      user.Followings.forEach(item => (item.followingId = item.id))
      user = user.Followings.sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)
      return callback({ user })
    })
  },

  getUserFollowers: (req, res, callback) => {
    return User.findByPk(req.params.id, {
      include: [{ model: User, as: 'Followers', attributes: ['id', 'account', 'name', 'introduction', 'createdAt'] }]
    }).then(user => {
      user = user.toJSON()
      user.Followers.forEach(item => {
        item.followerId = item.id
        item.isFollowed = Number(helpers.getUser(req).id) === Number(req.params.id)
      })

      user = user.Followers.sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)
      return callback({ user })
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
  }
}

module.exports = userService
