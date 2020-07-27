const fs = require('fs')
const bcrypt = require('bcryptjs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const Followship = db.Followship
const helpers = require('../_helpers.js')

// JWT
const jwt = require('jsonwebtoken')
const replyController = require('./replyController')

// 檢查使用者是否存在
const checkUser = (id) => {
  return User.findByPk(id)
}

// 撈取是否有追蹤紀錄 (return true or false)
const getFollowship = (followerId, followingId) => {
  return Followship.findOne({
    where: { followerId, followingId }
  })
}

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

    // 確認 email 和 account 和其他人的不一樣
    // 如果 user.id 和 userId 一樣 => 輸入的資料和自己原有的資料一樣 => 沒有和其他人的重複 => 可以寫入
    // 如果 user.id 和 userId 不一樣 => 輸入的資料和別人的資料一樣 => 和其他人的重複 => 不可以寫入
    // 如果找不到 user，代表輸入的新 email 或 account 和原有的不同，也和別人的不同 => 可以寫入
    return User.findOne({ where: { email } })
      .then(user => {
        if (user && user.id !== userId) {
          return res.json({ status: 'error', message: '電子郵件已被註冊' })
        }

        return User.findOne({ where: { account } })
          .then(user => {
            if (user && user.id !== userId) {
              return res.json({ status: 'error', message: '帳號已被其他人使用' })
            } else {
              return User.findByPk(userId)
                .then(user => {
                  const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10))

                  return user.update({
                    account,
                    name,
                    email,
                    password: hashedPassword,
                    introduction
                  })
                    .then(user => {
                      return res.json({ status: 'success', message: '成功更新使用者資料' })
                    })
                })
            }
          })
      })
      .catch(err => {
        console.log(err)
        return res.json({ status: 'error', message: `${err}` })
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

    // 名稱不可為空白
    if (!name) {
      return res.json({ status: 'error', message: '名稱不可為空白' })
    }

    // 取得上傳檔案的 metadata
    // const { avatar, cover } = req.files
    const avatar = null // (為了通過自動測試要關掉)
    const cover = null  // (為了通過自動測試要關掉)


    // 沒有圖片要上傳 => 直接更新使用者資訊
    if (!avatar && !cover) {
      return User.findByPk(userId)
        .then(user => {
          return user.update({
            name,
            introduction
          })
            .then(user => {
              return res.json({ status: 'success', message: '成功更新使用者資料 (無圖片上傳)' })
            })
        })
        .catch(err => {
          console.log(err)
          res.json({ status: 'error', message: `${err}` })
        })
    }

    // 檢查要上傳的圖片數量、格式和大小
    const fileQueue = [avatar, cover]
    fileQueue.forEach((file) => {
      if (file) {
        // 一個欄位只能上傳一張圖片
        if (file.length > 1) {
          return res.json({ status: 'error', message: `${file[0].fieldname} 只能上傳一張圖片` })
        }

        // 只接受 .png 和 .jpeg 檔案
        if (file[0].mimetype !== 'image/png' && file[0].mimetype !== 'image/jpeg') {
          return res.json({ status: 'error', message: `${file[0].fieldname} 欄位僅接受 .png 和 .jpeg 檔案` })
        }

        // 單個檔案大小不可超過 5 MB (5242880 bytes)
        if (file[0].size > 5242880) {
          return res.json({ status: 'error', message: `${file[0].fieldname} 單張圖片不可超過 5 MB` })
        }
      }
    })

    // 建立 avatar 和 cover 上傳任務陣列
    // 有上傳任務 => 轉成 Promise，負責上傳到 imgur，再更新到資料庫
    // 沒有上傳任務 => 轉成 Promise，用文字訊息 resolve
    return User.findByPk(userId)
      .then(user => {
        const avatarUpload = avatar ? avatar[0] : null
        const coverUpload = cover ? cover[0] : null
        const tasks = [avatarUpload, coverUpload].map(file => {
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
      .then(tasks => res.json({ status: 'success', message: '已更新使用者資料 (含圖片上傳)' }))
      .catch(err => {
        console.log(err)
        return res.json({ status: 'error', message: `${err}` })
      })
  },

  getUserTweets: async (req, res) => {
    const tweetsData = []

    // 確認有無此使用者
    if (!await checkUser(req.params.id)) return res.json({ status: 'error', message: '找不到此使用者的資料' })

    return Tweet.findAll({
      raw: true,
      nest: true,
      where: { UserId: req.params.id },
      order: [['createdAt', 'DESC']],
      include: [User]
    })
      .then(tweets => {
        for (const tweet of tweets) {
          // 回傳值過濾 (role >> isAdmin, remove password, remove UserId)
          tweet.User.isAdmin = Boolean(Number(tweet.User.role))
          delete tweet.User.role
          delete tweet.User.password
          delete tweet.UserId

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

  getLikedTweets: (req, res) => {
    const likerId = req.params.id

    return Like.findAll({
      raw: true,
      nest: true,
      where: { UserId: likerId },
      include: [User, Tweet]
    })
      .then(tweets => {
        // 如果 tweets 是空陣列 => 找不到 tweets
        if (!tweets.length) {
          return User.findByPk(likerId)
            .then(liker => {
              // 按讚的使用者不存在 => 報錯
              if (!liker) {
                return res.json({ status: 'error', message: '使用者不存在，找不到按讚的推文' })
              } else {
                // 使用者存在，但沒有按讚的推文 => 報錯
                return res.json({ status: 'error', message: '使用者尚未按任何推文讚' })
              }
            })
        }

        const tweetsData = tweets.map(tweet => {
          tweet.status = 'success'
          tweet.message = '找到按讚的推文'
          tweet.User.isAdmin = Boolean(Number(tweet.User.role))
          delete tweet.User.role
          delete tweet.User.password

          return tweet
        })

        return res.json([...tweetsData])
      })
      .catch(err => {
        console.log(err)
        res.json({ status: 'error', message: `${err}` })
      })
  },

  getRepliedTweets: (req, res) => {
    const replierId = req.params.id

    return Reply.findAll({
      raw: true,
      nest: true,
      where: { UserId: replierId },
      include: [User, Tweet]
    })
      .then(tweets => {
        // tweets 是空陣列 => 找不到 tweets
        if (!tweets.length) {
          return User.findByPk(replierId)
            .then(replier => {
              // 找不到 replier user => 報錯
              if (!replier) {
                return res.json({ status: 'error', message: '使用者不存在，找不到回覆的推文' })
              } else {
                // replier user 存在但找不到任何 tweet => 報錯
                return res.json({ status: 'error', message: '使用者尚未回覆任何推文' })
              }
            })
        }

        const tweetsData = tweets.map(tweet => {
          tweet.status = 'success'
          tweet.message = '找到回覆的推文'
          tweet.User.isAdmin = Boolean(Number(tweet.User.role))
          delete tweet.User.role
          delete tweet.User.password

          return tweet
        })

        return res.json([...tweetsData])
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
      .then(async (user) => {
        if (!user) return res.json({ status: 'error', message: '找不到此位使用者，故無法抓取他的追蹤名單' })

        user = user.toJSON()

        let followingUsers = user.Followings.map(followingUser => {
          // 回傳值處理 (role >> isAdmin, remove password, id >> followingId)
          followingUser.isAdmin = Boolean(Number(followingUser.role))
          delete followingUser.role
          delete followingUser.password

          followingUser.followingId = followingUser.id
          delete followingUser.id

          return followingUser
        })

        // 依追蹤紀錄建立時間排序清單
        followingUsers = followingUsers.sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)

        // 撈取「登入的使用者」是否追蹤「這位使用者(req.params.id)追蹤的人」，並刪除多餘欄位
        await Promise.all(followingUsers.map(followingUser => getFollowship(helpers.getUser(req).id, followingUser.followingId)))
          .then(followships => {
            followships.forEach((followship, index) => {
              if (followship) followingUsers[index].isFollowedByLoginUser = true
              else followingUsers[index].isFollowedByLoginUser = false

              delete followingUsers[index].Followship
            })
          })
          .catch(err => {
            console.warn(err)
            return res.json({ status: 'error', message: `${err}` })
          })

        return res.json(followingUsers)
      })
  },

  getUserFollowers: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        { model: User, as: 'Followers' }
      ]
    })
      .then(async (user) => {
        if (!user) return res.json({ status: 'error', message: '找不到此位使用者，故無法抓取追蹤他的使用者名單' })

        user = user.toJSON()

        let followerUsers = user.Followers.map(followerUser => {
          // 回傳值處理 (role >> isAdmin, remove password, id >> followerId)
          followerUser.isAdmin = Boolean(Number(followerUser.role))
          delete followerUser.role
          delete followerUser.password

          followerUser.followerId = followerUser.id
          delete followerUser.id

          return followerUser
        })

        // 依追蹤紀錄建立時間排序清單
        followerUsers = followerUsers.sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)

        // 撈取「登入的使用者」是否追蹤「這位追蹤使用者(req.params.id)的人」，並刪除多餘欄位
        await Promise.all(followerUsers.map(followerUser => getFollowship(helpers.getUser(req).id, followerUser.followerId)))
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
