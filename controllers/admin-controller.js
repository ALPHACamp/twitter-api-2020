const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Tweet, User } = require('../models')
const adminController = {
  login: async (req, res, next) => {
    try {
      // check account and password
      const { account, password } = req.body
      const user = await User.findOne({
        where: { account, role: 'admin' },
        attributes: ['id', 'account', 'name', 'email', 'password', 'role']
      })
      if (!user) return res.status(401).json({ status: 'error', message: '帳號不存在' })
      const isPasswordCorrect = await bcrypt.compare(password, user.password)
      if (!isPasswordCorrect) return res.status(401).json({ status: 'error', message: '帳號或密碼錯誤' })
      // sign token
      const userData = user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '14d' })
      res.status(200).json({ status: 'success', data: { token, user: userData } })
    } catch (err) {
      next(err)
    }
  },
  getTweets: (req, res, next) => {
    Tweet.findAll({
      include: [{ model: User, attributes: ['id', 'account', 'name', 'avatar'] }],
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true
    })
      .then(tweets => {
        const data = tweets.map(t => ({
          ...t,
          description: t.description.substring(0, 50)
        }))
        res.json(data)
      })
      .catch(err => next(err))
  }
}
module.exports = adminController
