const bcrypt = require("bcryptjs")
const db = require("../models")
const User = db.User
// JWT
const jwt = require("jsonwebtoken")
const passportJWT = require("passport-jwt")
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

let userController = {
  signIn: (req, res) => {
    if (!req.body.account || !req.body.password) {
      return res.json({ status: "error", message: "請輸入必填項目" })
    }

    User.findOne({
      where: { account: req.body.account },
    }).then((user) => {
      if (!user)
        return res.status(401).json({ status: "error", message: "此使用者尚未註冊" })
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(401).json({ status: "error", message: "密碼輸入錯誤" })
      }

      var payload = { id: user.id }
      var token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.json({
        status: "success",
        message: "ok",
        token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          account: user.account,
          role: user.role,
        },
      })
    })
  },

  signUp: (req, res) => {
    if (req.body.passwordCheck !== req.body.password) {
      return res.json({ status: "error", message: "兩次密碼輸入不同！" })
    } else {
      User.findOne({
        where: {
          $or: { email: req.body.email, account: req.body.account },
        },
      }).then((user) => {
        if (user) {
          if (user.email === req.body.email) {
            return res.json({ status: "error", message: "信箱重複！" })
          }
          if (user.account === req.body.account) {
            return res.json({ status: "error", message: "帳號重複！" })
          }
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            account: req.body.account,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
          }).then((user) => {
            return res.json({ status: "success", message: "成功註冊帳號！" })
          })
        }
      })
    }
  },
}

module.exports = userController
