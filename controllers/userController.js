const fs = require('fs')
const bcrypt = require('bcryptjs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const helpers = require('../_helpers.js')

// JWT
const jwt = require('jsonwebtoken')

const userController = {
  signUp: (req, res) => {
    // 初始值去除空白字元
    const account = (req.body.account) ? req.body.account.trim() : req.body.account
    const name = (req.body.name) ? req.body.name.trim() : req.body.name
    const email = (req.body.email) ? req.body.email.trim() : req.body.email
    const password = (req.body.password) ? req.body.password.trim() : req.body.password

    if (!account || !name || !email || !password) {
      return res.json({ status: 'error', message: '所有欄位均不能空白' })
    }

    // 確認 email、account 有無重複
    User.findOne({ where: { email } })
      .then(user => {
        if (user) return res.json({ status: 'error', message: '此信箱已被使用' })
        return User.findOne({ where: { account } })
      })
      .then(user => {
        if (user) return res.json({ status: 'error', message: '此帳號已被使用' })
        return User.create({
          account,
          name,
          email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
          role: 0
        })
      })
      .then(user => {
        return res.json({ status: 'success', message: '成功建立使用者資料' })
      })
      .catch(err => {
        console.log(err)
        return res.json({ status: 'error', message: `${err}` })
      })
  },

  signIn: (req, res) => {
    // 初始值去除空白字元
    const email = (req.body.email) ? req.body.email.trim() : req.body.email
    const password = (req.body.password) ? req.body.password.trim() : req.body.password

    // 檢查資料
    if (!email || !password) {
      return res.json({ status: 'error', message: '所有欄位均不能為空白' })
    }

    // 檢查 user 是否存在、密碼是否正確
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) return res.status(401).json({ status: 'error', message: '此帳號不存在' })
        if (!bcrypt.compareSync(password, user.password)) {
          return res.status(401).json({ status: 'error', message: '帳密錯誤' })
        }

        // 簽發 token
        const payload = { id: user.id }
        const token = jwt.sign(payload, process.env.JWT_SECRET)
        return res.json({
          status: 'success',
          message: '登入成功',
          token: token,
          user: {
            id: user.id, name: user.name, email: user.email, isAdmin: Boolean(Number(user.role))
          }
        })
      })
      .catch(err => {
        console.log(err)
        return res.json({ status: 'error', message: `${err}` })
      })
  },

  getUser: (req, res) => {
    User.findByPk(req.params.id)
      .then(user => {
        // 使用者不存在 => 報錯
        if (!user) return res.json({ status: 'error', message: '找不到使用者' })

        // 回傳值過濾 (role >> isAdmin, remove password)
        user = user.toJSON()
        user.isAdmin = Boolean(Number(user.role))
        delete user.role
        delete user.password

        console.log('user', user)

        // 使用者存在 => 回傳資料
        return res.json({
          status: 'success',
          message: '找到使用者的資料',
          ...user
        })
      })
      .catch(err => {
        console.log(err)
        return res.json({ status: 'error', message: `${err}` })
      })
  },

  // 更新設定頁的使用者文字資料
  putUser: (req, res) => {
    const userId = helpers.getUser(req).id
    const account = (req.body.account) ? req.body.account.trim() : req.body.account
    const name = (req.body.name) ? req.body.name.trim() : req.body.name
    const email = (req.body.email) ? req.body.email.trim() : req.body.email
    const password = (req.body.password) ? req.body.password.trim() : req.body.password
    const introduction = (req.body.introduction) ? req.body.introduction.trim() : req.body.introduction

    // 登入使用者 userId 和資料擁有者 req.params.id 不同 => 不可以進行編輯
    if (userId !== Number(req.params.id)) {
      return res.json({ status: 'error', message: '不可編輯其他人的使用者資料' })
    }

    if (!account || !name || !email || !password) {
      return res.json({ status: 'error', message: '帳號、名稱、電子郵件及密碼為必填欄位' })
    }

    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10))

    // 確認 email 和 account 和其他人的不一樣
    // 如果 user.id 和 userId 一樣 => 輸入的資料和自己原有的資料一樣 => 沒有和其他人的重複 => 可以寫入
    // 如果 user.id 和 userId 不一樣 => 輸入的資料和別人的資料一樣 => 和其他人的重複 => 不可以寫入
    // 如果找不到 user，代表輸入的新 email 或 account 和原有的不同，也和別人的不同 => 可以寫入
    User.findOne({ where: { email } })
      .then(user => {
        if (user && user.id !== userId) return res.json({ status: 'error', message: '電子郵件已被註冊' })

        return User.findOne({ where: { account } })
      })
      .then(user => {
        if (user && user.id !== userId) return res.json({ status: 'error', message: '帳號已被其他人使用' })

        return User.findByPk(userId)
          .then(user => {
            return user.update({
              account,
              name,
              email,
              password: hashedPassword,
              introduction
            })
              .then(user => res.json({ status: 'success', message: '成功更新使用者資料' }))
          })
      })
      .catch(err => {
        console.log(err)
        res.json({ status: 'error', message: `${err}` })
      })
  },

  // 更新使用者的名稱、自我介紹、cover 和 avatar 圖片
  putUserProfile: (req, res) => {
    const userId = helpers.getUser(req).id
    const name = (req.body.name) ? req.body.name.trim() : req.body.name
    const introduction = (req.body.introduction) ? req.body.introduction.trim() : req.body.introduction

    // 登入使用者 userId 和資料擁有者 req.params.id 不同 => 不可以進行編輯
    if (userId !== Number(req.params.id)) {
      return res.json({ status: 'error', message: '不可編輯其他人的使用者資料' })
    }

    if (!name) return res.json({ status: 'error', message: '名稱不可為空白' })

    // 判斷有沒有 avatar 和 cover 圖片上傳項目
    let { avatar, cover } = req.files
    avatar = avatar ? avatar[0] : null
    cover = cover ? cover[0] : null

    // 沒有圖片上傳任務，直接更新使用者資訊
    if (!avatar && !cover) {
      return User.findByPk(userId)
        .then(user => {
          return user.update({
            name,
            introduction
          })
            .then(user => {
              return res.json({ status: 'success', message: '成功更新使用者資料' })
            })
            .catch(err => {
              console.log(err)
              return res.json({ status: 'error', message: `${err}` })
            })
        })
    }

    return User.findByPk(userId)
      .then(user => {
        // 建立 avatar 和 cover 上傳任務陣列
        // 有上傳任務 => 轉成 Promise，負責上傳到 imgur，再更新到資料庫
        // 沒有上傳任務 => 轉成 Promise，用文字訊息 resolve
        const tasks = [avatar, cover].map(file => {
          if (file) {
            return new Promise((resolve, reject) => {
              imgur.setClientID(IMGUR_CLIENT_ID)
              imgur.upload(file.path, (err, img) => {
                if (err) reject(err)
                user.update({
                  name,
                  introduction,
                  [file.fieldname]: file ? img.data.link : user[file.fieldname]
                })
              })
              resolve('完成圖片上傳')
            })
          } else {
            return new Promise((resolve, reject) => {
              resolve('沒有上傳任務')
            })
          }
        })

        return Promise.all(tasks)
      })
      .then(tasks => res.json({ status: 'success', message: '已更新使用者資料' }))
      .catch(err => {
        console.log(err)
        res.json({ status: 'error', message: `${err}` })
      })
  },

  getUserTweets: (req, res) => {
    const tweetsData = []

    return Tweet.findAll({
      raw: true,
      nest: true,
      where: { UserId: req.params.id },
      order: [['createdAt', 'DESC']],
      include: [User]
    })
      .then(tweets => {
        for (const tweet of tweets) {
          // 回傳值過濾 (role >> isAdmin, remove password)
          tweet.User.isAdmin = Boolean(Number(tweet.User.role))
          delete tweet.User.role
          delete tweet.User.password

          tweetsData.push({
            status: 'success',
            message: '成功找到使用者的推文資料',
            ...tweet
          })
        }

        return res.json(tweetsData)
      })
      .catch(err => {
        console.log(err)
        res.json({ status: 'error', message: `${err}` })
      })
  }
}

module.exports = userController
