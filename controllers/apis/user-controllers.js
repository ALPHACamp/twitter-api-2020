const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { User, Identity, Tweet, Followship, Reply, Like } = require('../../models')
const helpers = require('../../_helpers')

const userController = {
  signIn: async (req, res, next) => {
    try {
      // 登入資料錯誤希望有回傳訊息
      const userData = helpers.getUser(req).toJSON()
      if (userData.Identity.identity === 'admin') {
        userData.is_admin = true
      } else {
        userData.is_admin = false
      }
      delete userData.password
      delete userData.Identity
      const token = jwt.sign(userData, process.env.JWT_SECRET, {
        expiresIn: '30d'
      })
      req.session.token = token
      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },

  signUp: async (req, res, next) => {
    try {
      if (req.body.password !== req.body.passwordCheck) {
        throw new Error('驗證密碼不正確')
      }
      const user = await User.findOne({ where: { account: req.body.account } })
      if (user) throw new Error('使用者已經存在')

      const userIdentity = await Identity.findOne({
        where: { identity: 'user' },
        attributes: ['id']
      })
      const { id } = userIdentity.toJSON()

      const registeredUser = await User.create({
        account: req.body.account,
        name: req.body.name,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 10),
        identityId: id
      })

      const token = jwt.sign(registeredUser.toJSON(), process.env.JWT_SECRET, {
        expiresIn: '30d'
      })
      const rawUserData = await User.findByPk(registeredUser.id)
      const userData = rawUserData.toJSON()
      userData.is_admin = false
      delete userData.password

      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },

  currentUser: (req, res, next) => {
    try {
      const userData = helpers.getUser(req).toJSON()
      const { token } = req.session
      if (userData.Identity.identity === 'admin') {
        userData.is_admin = true
      } else {
        userData.is_admin = false
      }
      delete userData.password
      delete userData.Identity
      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },

  getUser: async (req, res, next) => {
    try {
      const me = helpers.getUser(req)
      if (!me) return new Error('當前使用者產生預期外的錯誤')
      const my = await User.findAll({
        where: { id: me.id },
        attributes: ['id', 'account', 'name'],
        include: [
          { model: User, as: 'Follower', attributes: ['id'] }
        ]
      })

      const user = await User.findAll({
        where: { id: req.params.id },
        attributes: ['id', 'account', 'name', 'email', 'coverImg', 'avatarImg', 'bio'],
        include: [
          { model: User, as: 'Follower', attributes: ['id', 'name', 'account', 'avatarImg', 'bio'] },
          { model: User, as: 'Following', attributes: ['id', 'name', 'account', 'avatarImg', 'bio'] }
        ],
        nest: true
      })
      if (!user.length) throw new Error('使用者不存在')

      const myData = JSON.parse(JSON.stringify(my))
      const userData = JSON.parse(JSON.stringify(user))
      userData[0].is_following = Boolean(
        await Followship.findOne({
          where: {
            follower_id: me.id,
            following_id: req.params.id
          }
        })
      )

      userData[0].Follower = userData[0].Follower.map(record => {
        const isFollowing = Boolean(myData[0].Follower.find(following => following.id === record.id))
        return {
          ...record,
          is_following: isFollowing
        }
      })

      userData[0].Following = userData[0].Following.map(record => {
        const isFollowing = Boolean(myData[0].Follower.find(following => following.id === record.id))
        return {
          ...record,
          is_following: isFollowing
        }
      })

      res.json({ userData })
    } catch (err) {
      next(err)
    }
  },

  getUserTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        where: { user_id: req.params.id },
        attributes: ['id', 'description', 'user_id', 'created_at', 'updated_at'],
        include: [
          {
            model: User,
            attributes: ['id', 'account', 'name']
          },
          {
            model: Reply,
            attributes: ['id']
          },
          {
            model: Like,
            attributes: ['likeUnlike']
          }
        ],
        order: [['created_at', 'DESC']],
        nest: true
      })
      const data = tweets.map(tweet => {
        const replyTotal = tweet.Replies.length
        const likeTotal = tweet.Likes.filter(item => item.likeUnlike).length
        return {
          ...tweet.toJSON(),
          Replies: replyTotal,
          Likes: likeTotal
        }
      })
      return res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
