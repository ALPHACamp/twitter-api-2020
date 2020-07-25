const fs = require('fs')
const bcrypt = require('bcryptjs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Followship = db.Followship
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

        // 移除密碼，避免回傳時露出敏感資訊
        const safeUser = user.toJSON()
        delete safeUser.password

        // 使用者存在 => 回傳資料
        return res.json({
          status: 'success',
          message: '找到使用者的資料',
          ...safeUser
        })
      })
      .catch(err => {
        console.log(err)
        return res.json({ status: 'error', message: `${err}` })
      })
  },

  putUser: (req, res) => {
    const userId = Number(req.params.id)
    const account = (req.body.account) ? req.body.account.trim() : req.body.account
    const name = (req.body.name) ? req.body.name.trim() : req.body.name
    const email = (req.body.email) ? req.body.email.trim() : req.body.email
    const password = (req.body.password) ? req.body.password.trim() : req.body.password
    const introduction = (req.body.introduction) ? req.body.introduction.trim() : req.body.introduction

    if (!account || !name || !email || !password) {
      return res.json({ status: 'error', message: '填寫資訊不完整' })
    }

    // 確認 email 和 account 和其他人的不一樣
    // 如果 user.id 和 userId 一樣 => 輸入的資料和自己原有的資料一樣 => 沒有和其他人的重複 => 可以寫入
    // 如果 user.id 和 userId 不一樣 => 輸入的資料和別人的資料一樣 => 和其他人的重複 => 不可以寫入
    User.findOne({ where: { email } })
      .then(user => {
        if (user) {
          if (user.id !== userId) return res.json({ status: 'error', message: '電子郵件已被註冊' })
        }
        return User.findOne({ where: { account } })
      })
      .then(user => {
        if (user) {
          if (user.id !== userId) return res.json({ status: 'error', message: '使用者帳號不可重複' })
        }
        return User.findByPk(userId) // TO FH：你要找這個使用者才行，因為接下來要對他 update，否則他會是「有這個重複帳號的那位人」或是「無」
      })
      .then(user => {
        // 判斷有沒有 avatar 和 cover 圖片上傳項目
        let { avatar, cover } = req.files
        avatar = avatar ? avatar[0] : null
        cover = cover ? cover[0] : null

        const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10))

        // tasks 陣列項目存在 => 轉成 Promise，負責上傳到 imgur，再更新到資料庫
        const tasks = [avatar, cover].map(file => {
          if (file) {
            return new Promise((resolve, reject) => {
              imgur.setClientID(IMGUR_CLIENT_ID)
              imgur.upload(file.path, (err, img) => {
                if (err) reject(err)
                user.update({
                  account,
                  name,
                  email,
                  password: hashedPassword,
                  introduction,
                  [file.fieldname]: file ? img.data.link : user[file.fieldname]
                })
              })
              resolve('upload done')
            })
          } else {  // tasks 項目不存在 => 轉成 Promise，丟出文字訊息
            return new Promise((resolve, reject) => {
              resolve('no upload task')
            })
          }
        })

        // 判斷有沒有上傳任何圖片 => 執行對應的任務
        if (!avatar && !cover) {
          return user.update({
            account,
            name,
            email,
            password: hashedPassword,
            introduction,
          })
            .then(user => res.json({ status: 'success', message: '成功更新使用者資料' }))
        } else {
          return Promise.all(tasks)
            .then(results => res.json({ status: 'success', message: '成功更新使用者資料' }))
        }
      })
      .catch(err => {
        console.log(err)
        return res.json({ status: 'error', message: `${err}` })
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
  },

  getUserFollowings: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        { model: User, as: 'Followings' }
      ]
    })
      .then(user => {
        if (!user) return res.json({ status: 'error', message: '找不到此位使用者，故無法抓取他的追蹤名單' })

        user = user.toJSON()

        let followingUsers = user.Followings.map(followingUser => {
          // 回傳值過濾 (role >> isAdmin, remove password)
          followingUser.isAdmin = Boolean(Number(followingUser.role))
          delete followingUser.role
          delete followingUser.password

          return followingUser
        })

        // 依追蹤紀錄建立時間排序清單
        followingUsers = followingUsers.sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)

        // 刪除多餘欄位
        followingUsers = followingUsers.map(followingUser => {
          delete followingUser.Followship

          return followingUser
        })

        return res.json(followingUsers)
      })
  },

  getUserFollowers: (req, res) => {
    // 撈取是否有追蹤紀錄 (return true or false)
    const getFollowship = (followerId, followingId) => {
      return Followship.findOne({
        where: { followerId, followingId }
      })
    }

    return User.findByPk(req.params.id, {
      include: [
        { model: User, as: 'Followers' }
      ]
    })
      .then(async (user) => {
        if (!user) return res.json({ status: 'error', message: '找不到此位使用者，故無法抓取追蹤他的使用者名單' })

        user = user.toJSON()

        let followerUsers = user.Followers.map(followerUser => {
          // 回傳值過濾 (role >> isAdmin, remove password)
          followerUser.isAdmin = Boolean(Number(followerUser.role))
          delete followerUser.role
          delete followerUser.password

          return followerUser
        })

        // 依追蹤紀錄建立時間排序清單
        followerUsers = followerUsers.sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)

        // 撈取「登入的使用者」是否追蹤「這位追蹤使用者(req.params.id)的人」，並刪除多餘欄位
        await Promise.all(followerUsers.map(followerUser => getFollowship(helpers.getUser(req).id, followerUser.id)))
          .then(followships => {
            followships.forEach((followship, index) => {
              if (followship) followerUsers[index].isFollowedByLoginUser = true
              else followerUsers[index].isFollowedByLoginUser = false

              delete followerUsers[index].Followship
            })
          })
          .catch(err => {
            console.warn(err)
            return res.json({ status: 'error', message: `${err}` })
          })

        return res.json(followerUsers)
      })
  }
}

module.exports = userController
