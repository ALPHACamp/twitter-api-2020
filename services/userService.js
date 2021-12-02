const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const { User, Tweet, Followship } = require('../models')
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
    return User.findByPk(req.params.id, {
      include: [
        { model: Tweet, attributes: ['id'] },
        { model: User, as: 'Followings', attributes: ['id'] },
        { model: User, as: 'Followers', attributes: ['id'] },
        { model: User, as: 'Noticings', attributes: ['id'] },
        { model: User, as: 'Noticers', attributes: ['id'] }
      ]
    }).then(user => {
      user = {
        ...user.toJSON(),
        identify: Number(req.params.id) === Number(helpers.getUser(req).id),
        TweetCount: user.Tweets.length,
        followingCount: user.Followings.length,
        followerCount: user.Followers.length,
        isFollowed: user.Followers.some(i => (i.id === helpers.getUser(req).id)),
        isNoticed: user.Noticers.some(i => (i.id === helpers.getUser(req).id))
      }
      return callback({ user })
    })
  },

  putUser: (req, res, callback) => {
    if (Number(req.params.id) !== Number(helpers.getUser(req).id)) {
      return callback({ status: 'error', message: '沒有編輯權限！' })
    }

    if (req.body.account) {
      if (helpers.getUser(req).account !== req.body.account) {
        User.findOne({ where: { account: req.body.account }, raw: true }).then(user => {
          if (user) {
            return callback({ status: 'error', message: 'account 已重覆註冊！' })
          }
        })
      }
    }

    if (req.body.email) {
      if (helpers.getUser(req).email !== req.body.email) {
        User.findOne({ where: { email: req.body.email }, raw: true }).then(user => {
          console.log(user)
          if (user) {
            return callback({ status: 'error', message: 'email 已重覆註冊！' })
          }
        })
      }
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(req.params.id).then(user => {
          user
            .update({
              ...req.body,
              avatar: file ? img.data.link : user.avatar
            })
            .then(() => {
              callback({ status: 'success', message: '使用者資料編輯成功' })
            })
        })
      })
    } else {
      return User.findByPk(req.params.id).then(user => {
        user
          .update({
            ...req.body,
            avatar: user.avatar
          })
          .then(() => {
            return callback({
              status: 'success',
              message: '使用者資料編輯成功！'
            })
          })
      })
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
    return Followship.findOne({
      where: {
        followerId: helpers.getUser(req).id,
        followingId: req.params.followingId
      }
    }).then(followship => {
      followship.destroy().then(followship => {
        return callback({ status: 'success', message: '取消追隨成功' })
      })
    })
  },

  getUserFollowings: (req, res, callback) => {
    return User.findByPk(req.params.id, { include: [{ model: User, as: 'Followings' }] }).then(user => {
      user = user.toJSON()
      user.Followings.forEach(item => (item.followingId = item.id))
      return callback({ user: user.Followings })
    })
  },

  getUserFollowers: (req, res, callback) => {
    return User.findByPk(req.params.id, { include: [{ model: User, as: 'Followers' }] }).then(user => {
      user = user.toJSON()
      user.Followers.forEach(item => (item.followerId = item.id))
      return callback({ user: user.Followers })
    })
  }
}

module.exports = userService
