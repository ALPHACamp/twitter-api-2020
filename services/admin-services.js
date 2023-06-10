const bcrypt = require('bcrypt-nodejs')
const sequelize = require('sequelize')
const jwt = require('jsonwebtoken')
const {
  User,
  Tweet,
  Followship,
  Like,
  Reply
} = require('../models')

const adminServices = {
  signIn: async (req, cb) => {
    try {
      const { account, password } = req.body
      if (!account || !password) throw new Error('請輸入帳號和密碼！')

      const admin = await User.findOne({
        where: { account }
      })
      if (!admin) throw new Error('帳號不存在！')
      if (admin.role === 'user') throw new Error('帳號不存在！')
      if (!bcrypt.compareSync(password, admin.password)) throw new Error('帳密錯誤！')
      const payload = { id: admin.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' })
      const adminData = admin.toJSON()
      delete adminData.password
      return cb(null, {
        status: 'success',
        message: '登入成功！',
        token,
        admin: adminData
      })
    } catch (err) {
      cb(err)
    }
  },
  getUsers: (req, cb) => {
    User.findAll({
      raw: true,
      nest: true,
      attributes: [
        'account',
        'name',
        'avatar',
        'banner',
        [sequelize.fn('COUNT', sequelize.col('Followers.id')), 'followersCount'],
        [sequelize.fn('COUNT', sequelize.col('Followings.id')), 'followingsCount'],
        // [sequelize.fn('COUNT', sequelize.col('LikedTweets.id')), 'likeCount'],
        // [sequelize.fn('COUNT', sequelize.col('Replies.id')), 'replyCount']
      ],
      include: [
        {
          model: User,
          as: 'Followers',
          attributes: [],
          through: { attributes: [] }
        },
        {
          model: User,
          as: 'Followings',
          attributes: [],
          through: { attributes: [] }
        },
        // {
        //   model: Tweet,
        //   as: 'LikedTweets',
        //   attributes: [],
        //   through: { attributes: [] }
        // },
        // {
        //   model: User,
        //   as: 'Replies',
        //   attributes: [],
        //   through: { attributes: [] }
        // }
      ],
      group: ['User.id']
    })
      .then((users) => {
        cb(null, users)
      })
      .catch((error) => cb(error))
  },
}

module.exports = adminServices