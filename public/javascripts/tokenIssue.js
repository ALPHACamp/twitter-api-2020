const jwt = require('jsonwebtoken')
const PRIVATE_KEY = process.env.PRIVATE_KEY
// const fs = require('fs') 暫時用不到 是讀取私鑰用的
module.exports = (user) => {
  const id = user.id
  const expiresIn = 12 * 60 * 60 //以秒計算
  const payload = {
    sub: id,
    iat: Date.now()
  }

  const signToken = jwt.sign(payload, PRIVATE_KEY)

  return { token: signToken }
}