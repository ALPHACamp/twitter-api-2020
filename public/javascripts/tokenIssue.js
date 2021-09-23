const jwt = require('jsonwebtoken')
module.exports = (user) => {
  const TOKEN_KEY = user.role === 'user' ? 'process.env.USER_KEY' : 'process.env.ADMIN_KEY'
  const id = user.id
  const payload = {
    sub: id,
    iat: Date.now()
  }

  const signToken = jwt.sign(payload, TOKEN_KEY)

  return { token: signToken }
}