const fs = require('fs')
const bcrypt = require('bcryptjs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const db = require('../models')
const User = db.User
const Tweet = db.Tweet

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

        // 移除密碼，避免回傳時露出敏感資訊
        const safeUser = user.toJSON()
        delete safeUser.password

        // 使用者存在 => 回傳資料
        return res.json({
          status: 'success',
          message: '找到使用者的資料',
          user: safeUser
        })
      })
      .catch(err => {
        console.log(err)
        return res.json({ status: 'error', message: `${err}` })
      })
  },

  putUser: (req, res) => {
    const userId = Number(req.params.id)
    const account = req.body.account.trim()
    const name = req.body.name.trim()
    const email = req.body.email.trim()
    const password = req.body.password.trim()
    const introduction = req.body.introduction.trim()

    if (!account || !name || !email || !password) {
      return res.json({ status: 'error', message: '填寫資訊不完整' })
    }

    // 確認 email 和 account 和其他人的不一樣
    // 如果 user.id 和 userId 一樣 => 輸入的資料和自己原有的資料一樣 => 沒有和其他人的重複 => 可以寫入
    // 如果 user.id 和 userId 不一樣 => 輸入的資料和別人的資料一樣 => 和其他人的重複 => 不可以寫入
    User.findOne({ where: { email } })
      .then(user => {
        if (user.id !== userId) return res.json({ status: 'error', message: '電子郵件已被註冊' })
        return User.findOne({ where: { account } })
      })
      .then(user => {
        if (user.id !== userId) return res.json({ status: 'error', message: '使用者帳號不可重複' })
        return user
      })
      .then(user => {
        /////////////////////// 下面是有問題的 code  \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

        // 判斷有沒有 avatar 和 cover 圖片上傳項目
        let { avatar, cover } = req.files
        avatar = avatar ? avatar[0] : null
        cover = cover ? cover[0] : null

        console.log('avatar 資料', avatar)
        console.log('cover 資料', cover)

        const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10))

        const tasks = [avatar, cover].map(file => {
          if (file) {  // tasks 陣列項目存在 => 轉成 Promise，負責上傳到 imgur，再更新到資料庫
            console.log('上傳檔案資料', file)

            return new Promise((resolve, reject) => {
              imgur.setClientID(IMGUR_CLIENT_ID)
              imgur.upload(file.path, (err, img) => {
                user.update({
                  account,
                  name,
                  email,
                  password: hashedPassword,
                  introduction,
                  [file.fieldname]: file ? img.data.link : user[file.fieldname]
                })
              })
            })
          } else {  // 項目不存在 => 轉成 Promise，丟出文字訊息
            return new Promise((resolve, reject) => {
              resolve('no upload task')
            })
          }
        })

        console.log('tasks 內容', tasks)

        if (!avatar && !cover) {  // 沒有上傳任何圖片，直接更新使用者的其他資料
          return user.update({
            account,
            name,
            email,
            password: hashedPassword,
            introduction,
          })
            .then(user => res.json({ status: 'success', message: 'simple user 成功更新使用者資料' }))
        } else {  // 如果上傳一到二張圖片，等待每個 promise 確定狀態 (這邊會等待到 timeout)
          return Promise.all(tasks)
            .then(results => res.json({ status: 'success', message: 'promise 成功更新使用者資料' }))
        }

        /////////////////////// 上面是有問題的 code  \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
      })
      .then(results => {
        console.log(results)
      })
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
