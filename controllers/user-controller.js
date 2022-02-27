
const bcrypt = require('bcryptjs')
const { imgurFileHandler } = require('../helpers/file-helper')
const { User, Followship, Tweet, sequelize } = require('../models')
const jwtHelpers = require('../helpers/bearer-token-helper')
const helper = require('../_helpers')
const jwt = require('jsonwebtoken')
const formDataCheckHelpers = require('../helpers/formdata-check-helper')


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
      const message = await formDataCheckHelpers.postUsersFormDataCheck(req)

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
        avatar: "https://res.cloudinary.com/dqfxgtyoi/image/upload/v1644154630/github/defaultAvatar_uapauy.png",
        cover: "https://res.cloudinary.com/dqfxgtyoi/image/upload/v1645696452/github/defaultCover_uhyyds.jpg"
      })

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

      const tweets = await Tweet.findAll({
        where: { UserId: req.params.id },
        attributes: [
          'id',
          'UserId',
          'description',
          'createdAt',
          'updatedAt',
          'likeCount',
          'replyCount'
        ],
        include: [
          { model: User, attributes: ['id', 'name', 'account', 'avatar'], as: 'TweetAuthor' }
        ],
        order: [['createdAt', 'DESC']]
      })
      return res.json([...tweets])
    } catch (err) {
      next(err)
    }

  },
  putUserSetting: async (req, res, next) => {
    try {
      const id = Number(req.params.id)
      const currentId = helper.getUser(req).id

      if (id !== currentId) {
        return res.json({
          status: '400',
          message: '只能修改自己的資料'
        })
      }

      const { name, account, email, password } = req.body
      const message = await formDataCheckHelpers.postUsersFormDataCheck(req)

      if (message) {
        return res
          .status(400)
          .json({ status: 'error', message, data: req.body })
      }

      const user = await User.findByPk(id)
      await user.update({
        name,
        account,
        email,
        password: bcrypt.hashSync(password, BCRYPT_COMPLEXITY)
      })
      return res
        .status(200)
        .json({ status: 'success', message: '修改成功', data: user.toJSON() })
    } catch (error) {
      error.code = 500
      return next(error)
    }

  },
  putUser: async (req, res, next) => {
    try {
      const id = Number(req.params.id)
      const currentId = helper.getUser(req).id

      if (id !== currentId) {
        return res.json({
          status: '400',
          message: '只能修改自己的資料'
        })
      }

      const { name, introduction } = req.body
      const message = await formDataCheckHelpers.putUserCheck(req)
      if (message) {
        return res
          .status(400)
          .json({ status: 'error', message, data: req.body })
      }


      const avatar = req.files?.avatar
      const cover = req.files?.avatar
      

      const user = await User.findByPk(id, {attributes: { exclude: ['password'] }})
      if (!avatar && !cover) {
        await user.update({
          name,
          introduction
        })
      } else if (!avatar && cover) {
        await user.update({
          name,
          introduction,
          cover: await imgurFileHandler(cover[0])
        })
      } else if (avatar && !cover) {
        await user.update({
          name,
          introduction,
          avatar: await imgurFileHandler(avatar[0])
        })
      } else if (avatar && cover) {
        await user.update({
          name,
          introduction,
          avatar: await imgurFileHandler(avatar[0]),
          cover: await imgurFileHandler(cover[0])
        })
      }
      return res
        .status(200)
        .json({ status: 'success', message: '修改成功', data: user.toJSON() })
    } catch (error) {
      error.code = 500
      return next(error)
    }
  }
}

module.exports = userController
