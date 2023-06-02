const bcrypt = require('bcryptjs')
const { User } = require('../models')
const { Op } = require('sequelize')
const userController = {
  signUp: async (req, res, next) => {
    try {
      // 反查accout 與email 是否有被註冊過
      const user = await User.findOne({
        where: {
          [Op.or]: [{ account: req.body.account }, { email: req.body.email }]
        },
        raw: true,
        nest: true
      })
      if (user?.account === req.body.account) throw new Error('account已重複註冊!')
      if (user?.email === req.body.email) throw new Error('email已重複註冊!')

      const hash = await bcrypt.hash(req.body.password, 10)
      await User.create({
        name: req.body.name,
        account: req.body.account,
        email: req.body.email,
        password: hash,
        role: 'user',
        avatar: 'https://i.imgur.com/q6bwDGO.png',
        cover: 'https://i.imgur.com/1jDf2Me.png'
      })

      return res.status(200).json({
        status: 'success',
        message: '註冊成功'
      })
    } catch (err) {
      next(err)
    }
  }
}
module.exports = userController
