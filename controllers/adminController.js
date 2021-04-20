const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../models')
const User = db.User

module.exports = {
  login: (req, res) => {
    const { account, password } = req.body
    // validate user input
    if (!account || !password) {
      return res.status(400).json({ status: 'error', message: "Required fields didn't exist." })
    }

    // validate account and password
    User.findOne({ where: { account } }).then(user => {
      if (!user) return res.status(400).json({ status: 'error', message: 'Account does not exist.' })
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(400).json({ status: 'error', message: 'Passwords does not match.' })
      }
      if (user.role === 'user') {
        return res.status(403).json({ status: 'error', message: 'Administrator only. User permission denied.' })
      }
      // issue a token
      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' })
      return res.status(200).json({
        status: 'success',
        message: 'ok',
        token: token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          introduction: user.introduction,
          role: user.role,
          account: user.account,
          cover: user.cover,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      })
    })
      .catch(error => {
        const data = { status: 'error', message: error.toString() }
        console.log(error)
        return res.status(500).json(data)
      })
  }
}
