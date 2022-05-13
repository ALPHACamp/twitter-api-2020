const { User, Reply, Tweet, Like, Followship } = require('../models')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { getUser } = require('../_helpers')

const userController = {
  register: async (req, res, next) => {
    try {
      if (req.body.password !== req.body.checkPassword) throw new Error('密碼與確認密碼不符。')

      if (await User.findOne({ where: { account: req.body.account } })) throw new Error('此帳號已經註冊。')

      const user = await User.create({
        account: req.body.account,
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10)
      })
      res.json({ status: 'success', message: '註冊成功' })
    } catch (err) {
      next(err)
    }
  },
  login: async (req, res, next) => {
    try {
      const user = getUser(req)
      delete user.password
      const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.json({ status: 'success', token, user })
    } catch (err) {
      next(err)
    }
  },
  getUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id, {
        attributes: [
          'avatar', 'name', 'account', 'cover_image', 'introduction',
          [sequelize.literal('(SELECT COUNT(DISTINCT following_id) FROM Followships WHERE  following_id = User.id)'), 'followerCounts'],
          [sequelize.literal('(SELECT COUNT(DISTINCT follower_id) FROM Followships WHERE  follower_id = User.id)'), 'folloingCounts']
        ]
      })
      res.status(200).json(user)
    } catch (err) {
      next(err)
    }
  }
}
module.exports = userController
