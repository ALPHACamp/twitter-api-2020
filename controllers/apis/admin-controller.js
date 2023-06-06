const { User } = require('../../models')

const adminController = {
  adminLogin: async (req, res, next) => {
    const { account } = req.body
    const user = await User.findOne({
      where: { account },
      raw: true
    })
    if (!user) return res.json({ status: 'failed', data: 'You are not admin' })
    if (user.role !== 'admin') return res.json({ status: 'failed', data: 'You are not admin' })
    return res.json({ status: 'success', data: 'Welcome Back' })
  }
}

module.exports = adminController
