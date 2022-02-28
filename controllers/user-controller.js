
const bcrypt = require('bcryptjs')
const { imgurFileHandler } = require('../helpers/file-helper')
const { User, Followship, Tweet, Like, Reply, sequelize } = require('../models')
const jwtHelpers = require('../helpers/bearer-token-helper')
const helper = require('../_helpers')
const jwt = require('jsonwebtoken')
const {
  putUserCheck,
  putUserSettingCheck,
  postUsersFormDataCheck
} = require('../helpers/formdata-check-helper')


const BCRYPT_COMPLEXITY = 10

const userController = {
  login: (req, res, next) => {
    const error = new Error()
    const { account, password } = req.body

    if (!account || !password) {
      error.code = 400
      error.message = '所有欄位都要填寫'
      throw error
    }

    return User.findOne({ where: { account } })
      .then(user => {
        if (!user || user.role === 'admin') {
          error.code = 403
          error.message = '帳號不存在'
          throw error
        }

        return Promise.all([
          bcrypt.compare(password, user.password),
          user
        ])
      })
      .then(([isMatched, user]) => {
        if (!isMatched) {
          error.code = 403
          error.message = '帳號或密碼錯誤'
          throw error
        }

        const userData = user.toJSON()
        delete userData.password
        const token = jwt
          .sign(
            userData,
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
          )
        return res.json({
          status: 'success',
          token,
          data: userData

        })
      })
      .catch(error => {
        error.code = 500
        next(error)
      })
  },
  postUsers: async (req, res, next) => {

    try {
      const { name, account, email, password } = req.body
      const message = await postUsersFormDataCheck(req)

      if (message) {
        return res
          .status(400)
          .json({ status: 'error', message, data: req.body })
      }

      const user = await User.create({
        name,
        account,
        email,
        password: bcrypt.hashSync(password, BCRYPT_COMPLEXITY),
        role: "user",
        avatar: "https://res.cloudinary.com/dqfxgtyoi/image/upload/v1646039874/twitter/project/defaultAvatar_a0hkxw.png",
        cover: "https://res.cloudinary.com/dqfxgtyoi/image/upload/v1646039858/twitter/project/defaultCover_rx9g6m.jpg"
      })
      const result = user.toJSON()
      delete result.password

      return res
        .status(200)
        .json({ status: 'success', message: '註冊成功', data: user.toJSON() })
    } catch (error) {
      error.code = 500
      return next(error)
    }
  },
  getUser: async (req, res, next) => {
    try {
      const id = req.params.id
      const user = await User.findByPk(id, {
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' },
        ],
        attributes: { exclude: ['password'] }
      })
      const followedUsers = helper.getUser(req).Followings
      user.dataValues.isFollowed = followedUsers.some(fu => fu.id === user.id)

      return res.json(user)
    } catch (err) {
      next(err)
    }
  },
  getTopUsers: async (req, res, next) => {
    try {
      const user = await User.findAll({
        where: { role: 'user' },
        include: [{ model: User, as: 'Followers', attributes: { exclude: ['password'] } }],
        attributes: [
          'id',
          'name',
          'avatar',
          'account',
          'followerCount'
        ],
        order: [[sequelize.literal('followerCount'), 'DESC']],
        limit: 10,
      })

      const followedUsers = helper.getUser(req).Followings

      const results = user.map(u => ({
        ...u.toJSON(),
        isFollowed: followedUsers.some(fu => fu.id === u.id)
      }))

      return res.json({ status: 'success', message: '成功獲取', data: results })
    } catch (err) {
      next(err)
    }
  },
  getCurrentUser: async (req, res, next) => {
    try {
      const userId = helper.getUser(req).id

      const currentUser = await User.findByPk(userId, {
        attributes: [
          'id',
          'account',
          'email',
          'name',
          'avatar',
          'role',
          'cover',
          'followerCount',
          'followingCount',
          'tweetCount'
        ]
      })
      currentUser.dataValues.isExpiredToken = jwtHelpers.identifyJWT(req)
      return res.json({ status: 'success', message: '成功獲取', data: currentUser })
    } catch (err) {
      next(err)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      const currentId = helper.getUser(req).id
      const tweets = await Tweet.findAll({
        where: { UserId: req.params.id },
        attributes: [
          'id',
          'UserId',
          'description',
          'createdAt',
          'updatedAt',
          'likeCount',
          'replyCount',
          [
            sequelize.literal(
              `EXISTS (SELECT 1 FROM Likes WHERE UserId = ${currentId} AND TweetId = Tweet.id)`
            ),
            'isLiked',
          ],
          [
            sequelize.literal(
              `EXISTS (SELECT 1 FROM Replies WHERE UserId = ${currentId} AND TweetId = Tweet.id)`
            ),
            'isReplied'
          ]
        ],
        include: [
          { model: User, attributes: ['id', 'name', 'account', 'avatar'], as: 'TweetAuthor' }
        ],
        order: [['createdAt', 'DESC']]
      })
      const results = tweets.map(t => {
        t = t.toJSON()
        t.isLiked = Boolean(t.isLiked)
        t.isReplied = Boolean(t.isReplied)
        return t
      })

      return res.json([...results])
    } catch (err) {
      next(err)
    }

  },
  putUserSetting: async (req, res, next) => {
    try {
      const error = new Error()
      const id = Number(req.params.id)
      const currentId = helper.getUser(req).id

      if (id !== currentId) {
        error.code = 400
        error.message = '只能修改自己的資料'
        return next(error)
      }


      if (!(await User.findByPk(id))) {
        error.code = 404
        error.message = '對應使用者找不到'
        return next(error)
      }

      const { name, account, email, password } = req.body
      const message = await putUserSettingCheck(req)

      if (message) {
        return res
          .status(400)
          .json({ status: 'error', message, data: req.body })
      }


      await User.update({
        name,
        account,
        email,
        password: bcrypt.hashSync(password, BCRYPT_COMPLEXITY)
      }, { where: { id } })

      const result = { name, account, email }

      return res
        .status(200)
        .json({ status: 'success', message: '修改成功', data: result })
    } catch (error) {
      error.code = 500
      return next(error)
    }

  },
  putUser: async (req, res, next) => {
    try {
      const error = new Error()
      const id = Number(req.params.id)
      const currentId = helper.getUser(req).id
      const DEL_OPERATION_CODE = '-1'


      if (id !== currentId) {
        error.code = 400
        error.message = '只能修改自己的資料'
        return next(error)
      }
      const user = await User.findByPk(id)
      if (!user) {
        error.code = 404
        error.message = '對應使用者不存在'
        return next(error)
      }
      const { name, introduction, cover, avatar } = req.body
      const { files } = req

      const message = await putUserCheck(req)
      if (message) {
        return res
          .status(400)
          .json({ status: 'error', message, data: req.body })
      }

      let uploadAvatar = ''
      let uploadCover = ''

      if (cover === DEL_OPERATION_CODE) {
        uploadCover = 'https://res.cloudinary.com/dqfxgtyoi/image/upload/v1646039858/twitter/project/defaultCover_rx9g6m.jpg'
      } else {
        uploadCover = files && files.cover ?
          await imgurFileHandler(files.cover[0]) :
          user.cover
      }

      if (avatar === DEL_OPERATION_CODE) {
        uploadAvatar = 'https://res.cloudinary.com/dqfxgtyoi/image/upload/v1646039874/twitter/project/defaultAvatar_a0hkxw.png'
      } else {
        uploadAvatar = files && files.avatar ?
          await imgurFileHandler(files.avatar[0]) :
          user.avatar
      }

      await user.update({
        name,
        introduction,
        avatar: uploadAvatar,
        cover: uploadCover
      })
      const results = {
        account: user.account,
        name,
        introduction,
        avatar: uploadAvatar,
        cover: uploadCover
      }

      return res
        .status(200)
        .json({ status: 'success', message: '修改成功', data: results })
    } catch (error) {
      error.code = 500
      return next(error)
    }
  }
}

module.exports = userController
