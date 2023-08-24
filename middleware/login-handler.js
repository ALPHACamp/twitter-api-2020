const { getUser } = require('../_helpers')
const bcrypt = require('bcrypt')
const { User } = require('../models')

const userSignIn = async (req, res, next) => {
  try {
    const { account, password } = getUser(req).body
    if (!account || !password) throw new Error('帳號與密碼皆為必填!')
    // 在資料庫中尋找user
    const user = await User.findOne({ where: { account } })
    // 檢查使用者是否存在
    if (!user) throw new Error('帳號或密碼錯誤!')
    // 檢查使用者role是否為'user'
    if (user.role !== 'user') throw new Error('使用者不存在!')
    // 檢查密碼是否正確
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) throw new Error('帳號或密碼錯誤!')
    req.user = user
    next()
  } catch (err) {
    next(err)
  }
}

module.exports = {
  userSignIn
}
