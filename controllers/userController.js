const bcrypt = require('bcryptjs')
const { User } = require('../models')

let userController = {
  signUp: async (req, res) => {
    try {
      // confirm password
      if (req.body.checkPassword !== req.body.password) {
        return res
          .status(401)
          .json({ status: 'error', message: ' 兩次密碼不相同' })
      } else {
        // confirm unique user
        const email = await User.findOne({ where: { email: req.body.email } })
        const account = await User.findOne({
          where: { account: req.body.account },
        })
        if (email || account) {
          return res.status(401).json({
            status: 'error',
            message: '此信箱或帳號已註冊過！',
          })
        } else {
          await User.create({
            account: req.body.account,
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(
              req.body.password,
              bcrypt.genSaltSync(10)
            ),
          })
          return res
            .status(200)
            .json({ status: 'success', message: '成功註冊帳號！' })
        }
      }
    } catch (error) {
      console.log(error)
    }
  },
}

module.exports = userController
