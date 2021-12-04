/* DB */
const db = require('../../models')
const { User } = db

/* necessary package */
const bcrypt = require('bcryptjs')
// IMGUR
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = 'e34bbea295f4825'
// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy
//helpers
const helpers = require('../../_helpers')

const adminController = {
  //登入
  signIn: async (req, res) => {
    let { email, password } = req.body
    // 檢查必要資料
    if (!req.body.email || !req.body.password) {
      return res.json({
        status: 'error',
        message: "required fields didn't exist"
      })
    }
    // 檢查 user 是否存在與密碼是否正確
    const user = await User.findOne({ where: { email } })
    if (!user)
      return res
        .status(401)
        .json({ status: 'error', message: 'no such user found' })
    if (!bcrypt.compareSync(password, user.password)) {
      return res
        .status(401)
        .json({ status: 'error', message: 'passwords did not match' })
    }
    if (user.role !== 'admin') {
      return res
        .status(401)
        .json({ status: 'error', message: 'Permission denied' })
    }
    // 簽發 token
    var payload = { id: user.id }
    var token = jwt.sign(payload, 'alphacamp')
    return res.json({
      status: 'success',
      message: 'ok',
      token: token,
      user
    })
  }
}

module.exports = adminController
