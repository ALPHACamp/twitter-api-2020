const { User } = require('../models')
const bcrypt = require('bcryptjs')

const adminSignin = async (req, res, next) => {
  try {
    const { account, password } = req.body

    if (!account || !password) {
      throw new Error('Both account and password are required!')
    }

    const admin = await User.findOne({ where: { account } })

    // 驗證
    if (!admin) {
      throw new Error('Account does not exist.')
    }
    if (admin.role !== 'admin') {
      throw new Error('Account does not exist.')
    }
    if (!bcrypt.compareSync(password, admin.password)) {
      throw new Error('Incorrect username or password!')
    }

    // 如果通過驗證，將管理者資訊存儲在 req.user 中
    req.user = admin
    next()
  } catch (err) {
    next(err)
  }
}

module.exports = {
  adminSignin
}
