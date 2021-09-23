const jwt = require('jsonwebtoken')
module.exports = (user) => {
  const PRIVATE_KEY = user.role === 'user' ? 'iamrexalsoturagon' : 'rexrubyarmokaiyu'
  const id = user.id
  const payload = {
    sub: id,
    iat: Date.now()
  }

  const signToken = jwt.sign(payload, PRIVATE_KEY)

  return { token: signToken }
}