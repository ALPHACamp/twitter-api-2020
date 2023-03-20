const { Tweet } = require('../models')
const adminController = {
  // 登入
  signIn: async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ status: 'error', message: 'Email and password are required' })
    }
    try {
      const user = await User.findOne({ where: { email } })     
      if (!user) return res.status(404).json({ status: 'error', message: 'User does not exist' })
      if (user.role === 'user') return res.status(404).json({ status: 'error', message: 'User does not exist' })
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: 'Incorrect password' })
      }
      const userData = user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET)
      return res.status(200).json({
        status: 'success',
        message: 'Successfully sign in',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },
  getTweet: async (req, res, next) => {
    res.json({ data: { test: '測試' } })
  }
}
module.exports = adminController
