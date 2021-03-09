const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../models/index')
const User = db.User

module.exports = async (req, res, role) => {
  const { account, password } = req.body
  try {
    // check input
    if (!account || !password) {
      return res.status(400).json({ status: 'error', message: '所有欄位都要填!!!', account, password })
    }
    // check if user exists
    let user = await User.findOne({ where: { account } }).catch((err) => console.log('existedAccount: ', err))
    if (!user) {
      return res.status(400).json({ status: 'error', message: '此帳號不存在!!!', account, password })
    }
    user = user.toJSON()
    // check if password correct
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({ status: 'error', message: '密碼錯誤!!!', account, password })
    }
    const loginPage = role === 'admin' ? '後台' : '前台'

    if (user.role !== role) {
      return res.status(403).json({ status: 'error', message: `此用戶沒有${loginPage}權限。`, account, password })
    }
    // sign and send jwt
    const payload = { id: user.id }
    const token = jwt.sign(payload, process.env.JWT_SECRET)
    return res.status(200).json({
      status: 'success',
      message: '成功登入!!!',
      token,
      user: { ...user, password: '' }
    })
  } catch (err) {
    console.log('catch block: ', err)
    return res.status(500).json({ status: 'error', message: '伺服器出錯，請聯繫客服人員，造成您的不便，敬請見諒。', account, password })
  }
}
