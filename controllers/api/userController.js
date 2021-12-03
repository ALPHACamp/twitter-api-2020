/* necessary package */
const bcrypt = require('bcryptjs')
const IMGUR_CLIENT_ID = 'e34bbea295f4825'
const imgur = require('imgur-node-api')
/* DB */
const db = require('../../models')
const { User, Tweet, Like, Reply } = db

// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy
const helpers = require('../../_helpers')

let userController = {
  //註冊
  signIn: (req, res) => {
    // 檢查必要資料
    if (!req.body.email || !req.body.password) {
      return res.json({ status: 'error', message: "required fields didn't exist" })
    }
    // 檢查 user 是否存在與密碼是否正確
    let username = req.body.email
    let password = req.body.password

    User.findOne({ where: { email: username } }).then(user => {
      if (!user) return res.status(401).json({ status: 'error', message: 'no such user found' })
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: 'passwords did not match' })
      }
      // 簽發 token
      var payload = { id: user.id }
      var token = jwt.sign(payload, 'alphacamp')
      return res.json({
        status: 'success',
        message: 'ok',
        token: token,
        user: {
          id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin
        }
      })
    })
  },
  //登入
  signUp: (req, res) => {
    if (req.body.checkPassword !== req.body.password) {
      return res.json({ status: 'error', message: '兩次密碼輸入不同！' })
    } else {
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          return res.json({ status: 'error', message: '信箱重複！' })
        } else {
          User.create({
            account: req.body.account,
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            return res.json({ status: 'success', message: '成功註冊帳號！' })
          })
        }
      })
    }
  },
  putUsers: async (req, res) => {
    try {
      // 確保只有自己能修改自己的資料
      if (helpers.getUser(req).id !== Number(req.params.id)) {
        return res.json({ status: 'error', message: '無法變更他人資料' })
      }

      // 確保name和email皆有輸入
      if (!req.body.name || !req.body.email) {
        return res.json({ status: 'error', message: 'name或email尚未輸入' })
      }

      // 確認email在資料庫沒有重複
      if (helpers.getUser(req).email !== req.body.email) {
        const emailCheck = await User.findOne({ where: { email: req.body.email } })
        if (JSON.stringify(emailCheck) !== '{}') {
          return res.json({ status: 'error', message: '此email已註冊過' })
        }
      }

      // 如果有上傳圖片 update
      const { files } = req
      if (files) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(files.avatar[0].path, (err, img1) => {
          imgur.upload(files.cover[0].path, async (err, img2) => {
            const user = await User.findByPk(req.params.id)
            await user.update({
              ...req.body,
              avatar: img1.data.link,
              cover: img2.data.link,
            })
          })
        })
        res.json({ status: 'success', message: '使用者資料編輯成功' })
        // 如果沒上傳圖片 update
      } else {
        const user = await await User.findByPk(req.params.id)
        await user.update({
          ...req.body,
          avatar: null,
          cover: null,
        })
        res.json({ status: 'success', message: '使用者資料編輯成功' })
      }
    } catch (err) {
      console.log(err)
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id)
      if (!user || user.role === 'admin') {
        return res.json({ status: 'error', message: 'No user' })
      } else {
        return res.json(user)
      }
    } catch (err) {
      console.log(err)
    }
  },
  getTweets: (req, res) => {
  }

}

module.exports = userController
