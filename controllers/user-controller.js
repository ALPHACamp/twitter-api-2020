const { User } = require('../models/user')
const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const userController = {
  signin: async (req, res) => {
    try {
      try {
        const { account, password } = req.body
        if (!account || !password) {
          return res.status(StatusCodes.NOT_ACCEPTABLE)
            .json({
              status: 'error',
              message: '必填欄位不可空白'
            })
        }
        const user = await User.findOne({ where: { account } })
        if (!user) {
          return res.status(StatusCodes.UNAUTHORIZED)
            .json({
              status: 'error',
              message: '帳號或密碼錯誤'
            })
        }
        const isPasseordMatched = await bcrypt.compare(password, user.password)

        if (!isPasseordMatched) {
          return res.status(StatusCodes.UNAUTHORIZED)
            .json({
              status: 'error',
              message: '帳號或密碼錯誤'
            })
        }

        const payload = {
          id: user.id,
          isAdmin: user.isAdmin
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' })
        return res.status(StatusCodes.OK).json({
          status: 'success',
          message: '登入成功',
          token,
          data: {
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
              image: user.image,
              isAdmin: user.isAdmin
            }
          }
        })
      } catch (error) {
        console.log(error)
      }
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = userController
