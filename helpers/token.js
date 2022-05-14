const jwt = require('jsonwebtoken')

const createToken = async (userData) => {
  return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '10d' })
}

module.exports = createToken
