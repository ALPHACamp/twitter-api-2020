const db = require('../models')
const { User, Tweet } = db
const bcrypt = require('bcryptjs')

const adminService = {
  // 登入
  signIn: (req, res, callback) => {
    // 檢查必要資料
    if (!req.body.email || !req.body.password) {
      callback({ status: 'error', message: "required fields didn't exist" })
      // return res.json({ status: 'error', message: "required fields didn't exist" })
    }
    // 檢查 user 是否存在與密碼是否正確
    let username = req.body.email
    let password = req.body.password

    User.findOne({ where: { email: username } })
      .then((user) => {
        // 帳號不存在
        if (!user) {
          callback({ status: 'error', message: 'no such user found' })
          // return res.status(401).json({ status: 'error', message: 'no such user found' })
        }

        // 密碼錯誤
        if (!bcrypt.compareSync(password, user.password)) {
          callback({ status: 'error', message: 'passwords did not match' })
          // return res.status(401).json({ status: 'error', message: 'passwords did not match' })
        }

        // 簽發 token
        let payload = { id: user.id }
        let token = jwt.sign(payload, process.env.JWT_SECRET)
        callback({
          status: 'success',
          message: 'ok',
          token: token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
          }
        })
        // return res.json({
        //   status: 'success',
        //   message: 'ok',
        //   token: token,
        //   user: {
        //     id: user.id,
        //     name: user.name,
        //     email: user.email,
        //     isAdmin: user.isAdmin
        //   }
        // })
      })
  },


}

module.exports = adminService