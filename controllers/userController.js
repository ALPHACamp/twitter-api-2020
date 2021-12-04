const bcrypt = require('bcryptjs')
const { User, Followship } = require('../models')

// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const userController = {
  //signIn & signUp
  signIn: (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
      return res.json({
        status: 'error',
        message: "required fields didn't exist",
      })
    }

    User.findOne({ where: { email } }).then((user) => {
      if (!user)
        return res
          .status(401)
          .json({ status: 'error', message: 'no such user found' })
      if (!bcrypt.compareSync(password, user.password)) {
        return res
          .status(401)
          .json({ status: 'error', message: 'passwords did not match' })
      }
      // 簽發 token
      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.json({
        status: 'success',
        message: 'ok',
        token: token,
        user: {
          id: user.id,
          role: user.role,
        },
      })
    })
  },

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
          const user = await User.create({
            account: req.body.account,
            name: req.body.name,
            email: req.body.email,
            role: 'user',
            password: bcrypt.hashSync(
              req.body.password,
              bcrypt.genSaltSync(10)
            ),
          })
          return res
            .status(200)
            .json({ status: 'success', message: '成功註冊帳號！', user:{id:user.id,email:user.email},})
        }
      }
    } catch (error) {
      console.log(error)
    }
  },

  //user
  getUser: async (req, res) => {
    try {
      const user = (await User.findByPk(req.params.id,
      {
        attributes: [
          'id',
          'account',
          'name',
          'email',
          'avatar',
          'cover',
          'introduction',
        ],
      })).toJSON()
      return res.status(200).json({
        status: 'success',
        message: 'ok',
        ...user,
      })
    } catch (error) {
      console.log(error)
      return res
        .status(500)
        .json({ status: 'error', message: 'service error!' })
    }
  },
}

module.exports = userController
