const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const { User, Sequelize, sequelize } = require('../../models')
const { Op } = Sequelize
const helpers = require('../../_helpers.js')
const { userDataTransform, dateFieldsToTimestamp } = require('../../modules/controllerFunctions.js')


const userController = {
  signUp: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body

      // create new user
      await User.create({
        account, name, email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
      })
      return res.json({
        status: 'success',
        message: '成功註冊'
      })
    } catch (error) {
      next(error)
    }
  },

  signIn: async (req, res, next) => {
    try {
      const { account, password } = req.body
      const user = await User.findOne({ where: { account }, raw: true })

      if (!bcrypt.compareSync(password, user.password)) return res.json({
        status: 'error',
        message: '帳號或密碼錯誤'
      })

      return res.json({
        status: 'success',
        message: '成功登入',
        token: jwt.sign({ id: user.id }, process.env.JWT_SECRET),
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      })

    } catch (error) {
      next(error)
    }
  },

  getUser: async (req, res, next) => {
    try {
      const id = Number(req.params.id)
      if (!id) return res.json({ status: 'error', message: '查無此使用者編號' })
      let user = await User.findByPk(id, {
        attributes: {
          include: [
            [sequelize.literal(`(SELECT Count(*) FROM Followships AS f WHERE f.followerId=${id})`), 'FollowingsCount'],
            [sequelize.literal(`(SELECT Count(*) FROM Followships AS f WHERE f.followingId=${id})`), 'FollowersCount']
          ]
        },
        include: { model: User, as: 'Followings' }
      })
      if (!user) return res.json({ status: 'error', message: '查無此使用者編號' })
      user = userDataTransform(req, user.dataValues)
      return res.json({ status: 'success', ...user })
    } catch (error) {
      next(error)
    }
  },

  getUsers: async (req, res, next) => {
    try {
      let users = await User.findAll({
        where: {
          id: { [Op.ne]: helpers.getUser(req).id },
          role: { [Op.eq]: null }
        },
        attributes: {
          include: [
            [sequelize.literal(`(SELECT Count(*) FROM Followships AS f WHERE f.followingId=User.id)`), 'FollowersCount']
          ]
        },
        order: [[sequelize.literal('FollowersCount'), 'DESC']],
        offset: Number(req.query.startIndex) || 0,
        limit: Number(req.query.accumulatedNum) || 10
      })

      users = users.map(user => userDataTransform(req, user.dataValues))

      return res.json({ status: 'success', users })
    } catch (error) {
      next(error)
    }
  },

  getTweets: async (req, res, next) => { },

  getLikeTweets: async (req, res, next) => { },

  getFollowers: async (req, res, next) => { },

  getFollowings: async (req, res, next) => { },

  getRepliedTweets: async (req, res, next) => { },

  updateProfile: async (req, res, next) => { },

}

module.exports = userController