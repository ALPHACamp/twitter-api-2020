// 載入所需套件
const { User, Tweet } = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const adminService = {
  adminLogin: async (req, res, callback) => {
    const { email, password } = req.body

    // 確認欄位是否皆有填寫
    if (!email || !password) {
      return callback({ status: 'error', message: 'email或password未填寫' })
    }

    // 檢查email＆password＆role是否為admin
    const user = await User.findOne({ where: { email } })
    if (!user || !bcrypt.compareSync(password, user.password) || user.role === 'user') {
      return callback({ status: 'error', message: '帳號不存在！' })
    }

    const payload = { id: user.id }
    const token = jwt.sign(payload, process.env.JWT_SECRET)
    return callback({
      status: 'success',
      message: '成功登入',
      token: token,
      user: {
        id: user.id,
        role: user.role
      }
    })
  },

  getAllTweets: async (req, res, callback) => {
    try {
      //撈出所有tweet資料，並取得關聯User的資料
      const tweets = await Tweet.findAll({
        raw: true,
        nest: true,
        attributes: ['id', 'description', 'createdAt'],
        include: [{ model: User, attributes: ['id', 'account', 'name', 'avatar'] }],
        order: [['createdAt', 'DESC']]
      })
      return callback(tweets)
    } catch (err) {
      console.log(err)
    }
  }

}

// adminController exports
module.exports = adminService